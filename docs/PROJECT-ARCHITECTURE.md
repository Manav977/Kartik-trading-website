# Kartik Trading Co. — Living Architecture

This project is a Vite + React front-end for Kartik Trading Co., a wholesale storefront that lets verified partners browse a curated catalog, manage a cart, and place orders that are routed through WhatsApp while being stored for simple admin oversight.

## 1. Vision & Intent
- **Audience:** B2B retailers who already trust the brand and prefer fast ordering over WhatsApp instead of a full checkout funnel.
- **Experience:** Lightweight hero + product discovery experience, persistent cart, instant OTP/Google authentication, and delivery detail capture before a one-click WhatsApp order.
- **Control plane:** A guarded admin panel that shows low-stock indicators, lets staff add/remove products, adjust stock, and clean up orders captured from the live storefront.

## 2. Getting-Started Cheat Sheet
1. `npm install` (uses Node 20+ / npm 10+ for Vite 7.x).  
2. Create a `.env` file matching the keys consumed in `src/Firebase.js`:
   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```
3. `npm run dev` for hot-reloaded development or `npm run build` + `npm run preview` for production preview.
4. Optional: run `npm run lint` to verify ESLint (uses `@eslint/js`, React plugin).

## 3. Folder & Feature Map
```
src/
├── App.jsx           # Central state & side-effects
├── Firebase.js       # Firebase config & exports
├── main.jsx          # Entrypoint (renders BrowserRouter + App)
├── Components/
│   ├── Home/         # Header, hero, sliders, testimonials
│   ├── Pages/        # Auth modal, contact page, landing wrappers
│   ├── Products/     # Address modal, cart drawer, product grid
│   ├── About/        # Core values + footer
│   ├── Adminpanel.jsx/# Admin dashboard GUI
│   └── CustomHooks/  # `Apicall` wrapper for Realtime Database sync
└── assets/           # Static logos/fonts used by header
```

## 4. Core Runtime Flows

### 4.1 Authentication & persistence (`App.jsx`, `Auth.jsx`, `Header.jsx`)
- `Auth.jsx` supports OTP-based login/registration and Google sign-in via Firebase Auth, storing new users under `users/{uid}` with metadata (`phone`, `city`, `role`, `createdAt`).
- `App.jsx` listens for `onAuthStateChanged` to keep the in-app `user` state in sync and to load/clear the persisted cart.
- `Header.jsx` re-reads `onAuthStateChanged` for UI tweaks, exposes the admin link only to whitelisted emails, and wires the search box to `/products`.
- Closing `Auth` auto-reloads the page so header/carts refresh immediately after login.

### 4.2 Product discovery (`Products.jsx`, `Apicall.jsx`)
- Firestore collection `products` is loaded once via `getDocs`. Every document is normalized to `{id, ...data}`.
- `Apicall.jsx` hits a Firebase Realtime Database root to pull any legacy OR partner-fed catalog, and `Products.jsx` merges those items behind the scenes.
- Filtering binds to the search term and optional category from `App.jsx`, while pagination keeps eight cards visible per page.
- Every card delegates to `onAddToCart` so the shared cart state in `App.jsx` can handle quantities.

### 4.3 Cart + checkout (`Cart.jsx`, `Address.jsx`, WhatsApp + Firestore order flow)
- `Cart.jsx` is a drawer that reads `cart`, allows quantity tweaks, and shows a managed address section.
- Quantity changes and removals call `setCart`, which reflexively calls `saveCartToFirestore()` in `App.jsx` so the Firestore user document stays current.
- `handleFinalOrderFlow` runs when the user taps “Order on WhatsApp”:
  1. Verifies authentication and that `userAddress` exists (otherwise opens `AddressModal`).
  2. Adds an `orders` document with items, timestamp, status, and address.
  3. Composes a user-friendly WhatsApp message and opens `https://wa.me/…` in a new tab.
  4. Clears the cart locally and in Firestore, then closes the drawer with toasts for feedback.

### 4.4 Address capture (`Address.jsx`)
- Pre-fills phone/address from `users/{uid}` when the modal opens.
- Validates phone digits + address length before calling `onSubmit`.
- `App.jsx#handleDetailsSubmit` writes the payload to Firestore and updates `userAddress`.

### 4.5 Admin dashboard (`AdminPanel.jsx`)
- `onSnapshot` keeps `products` and `orders` live in the dashboard without manual refresh.
- Three tabs: Dashboard (stock badges), Products (add, adjust stock, delete), Orders (view, delete).
- Inline stock editing calls `updateDoc` on blur; deletions call `deleteDoc`. Adds show/hide statuses using local `statusMsg`.

### 4.6 Secondary pages
- `Home.jsx` stitches together hero, CTA ∙ `Header`, `Footer`.
- `Contact.jsx` uses EmailJS to forward submissions using service/template IDs (`Kartik_`, etc.) and renders a Google map iframe.
- `About` area bundles `CoreValues` + `Footer` for marketing content.

## 5. Data Model / Firebase Shape
- `users/{uid}` – `uid`, `displayName`, `email`, `phoneNumber`, `phone`, `city`, `address`, `cart`, `role`, timestamps.
- `products/{id}` – `title`, `price`, `image`, `category`, `stock`.
- `orders/{id}` – `userId`, `userName`, `items`, `address`, `phone`, `status`, `timestamp`.
- Cart lives both in-memory (`App.jsx`) and in every user document via `saveCartToFirestore`.
- Admin snapshot watchers handle `products` + `orders`.

## 6. External Integrations
| Service | Purpose |
| --- | --- |
| Firebase Auth & Firestore | Auth, cart persistence, products, orders, realtime snapshots |
| Firebase Realtime Database | Legacy product list retrieved through `Apicall.jsx` |
| EmailJS | Contact form submissions |
| WhatsApp Web | Shortcut for final ordering message using `wa.me` links |
| react-hot-toast | Visual feedback during login, cart updates, checkout |

## 7. Visual & UX Layers
- Styling is done with CSS Modules (`*.module.css`) so each component keeps scoped class names.
- Shared utilities: `Navbar` uses `Logo` from `src/assets`; `Footer` is reused across product/about/contact pages.
- Hamburger/drawer states are managed locally within each component (`Header.jsx`, `Cart.jsx`).

## 8. Diagram: User + Admin Interaction
```mermaid
flowchart TD
  User[User Browser]
  User -->|search & view| ProductsPage{{Products.jsx}}
  StudentCart[Cart state in App.jsx]
  ProductsPage -->|addToCart| StudentCart
  StudentCart -->|persist| FirestoreUsers[users/{uid}.cart]
  StudentCart -->|checkout| OrderFlow((handleFinalOrderFlow))
  OrderFlow --> WhatsApp[WhatsApp API]
  OrderFlow --> FirestoreOrders[orders collection]
  AdminPanel -->|snapshot| FirestoreOrders
  AdminPanel -->|snapshot| FirestoreProducts
  ApiCall --> RealtimeDB[Realtime Database (legacy catalog)]
  RealtimeDB --> ProductsPage
```

## 9. Maintenance Notes
- Keep `ADMIN_EMAILS` in sync between `Header.jsx` and `App.jsx` for consistent gatekeeping.
- When editing Firestore rules, ensure `users/{uid}` can only read/write its own document (cart/address) and `orders` is writable by server/admin only.
- `window.location.reload()` after login is a quick fix; removing it will require the header/cart to wire `onAuthStateChanged` updates more carefully.

## 10. Next Steps
1. Document Firestore security rules + add validation (e.g., `price > 0`, `stock` non-negative).  
2. Replace `window.location.reload()` with context/state updates so UI reflects login immediately without a hard refresh.  
3. (Optional) Add unit/integration tests around cart math and `handleFinalOrderFlow` using `vitest` or `React Testing Library`.
