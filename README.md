
# 🛡️ SOS Officials Dashboard

This is the **officials-side web application** for the SOS Emergency Response System. It provides a real-time interface for emergency responders to view, verify, and respond to emergency requests submitted by users through the mobile app.

---

## 🚀 Features

- 🔐 **Secure Login and Role-based Access**
- 🖼️ **Image & Video Viewer** – Decrypted emergency uploads from users.
- 📍 **Live Geolocation Integration** – Powered by Google Maps API.
- 🧠 **ML-Verified Alerts** – Review AI-classified medical/fire emergencies.
- ✅ **Accept/Reject Workflow** – Officials can respond to or ignore flagged reports.
- 🛠️ **Password Reset & Auth Flows** – Includes Forgot/Reset Password modules.

---

## 🗂 Project Structure

```
/src/
├── assets/                # Static assets like icons, logos, etc.
├── App.jsx                # Main app component
├── App.css                # Global styles
├── Landing.jsx            # Landing page or redirect
├── Login.jsx / Login.css  # Login screen
├── ForgotPassword.jsx     # Forgot password form
├── ResetPassword.jsx      # Reset link handler
├── dashboard.jsx / .css   # Main dashboard UI for viewing requests
├── Maps.jsx               # Google Maps component for location display
├── Cont.jsx               # Reusable content block / layout helper
├── supabaseClient.js      # Supabase client initialization
├── main.jsx               # Root ReactDOM rendering entry
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sos-officials-dashboard.git
cd sos-officials-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file and add your Supabase project credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

> These are used in `supabaseClient.js` to connect to your backend.

### 4. Start the App

```bash
npm run dev
```

The app runs at: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Authentication

- Uses Supabase Auth for login, password reset, and session handling.
- Cookies/session support enabled.
- Only verified responders (e.g., fire, medical, crime) have access.

---

## 📦 Built With

- [React.js](https://reactjs.org/)
- [Supabase](https://supabase.com/)
- [Vite](https://vitejs.dev/)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview)

---

## 🙋 Author

**Arpit Gupta**  
This module was developed as the admin/official portal for the SOS Emergency System.

---

## 📄 License

This project is licensed under the MIT License.
