# The Pickle Pot 🫙

A modern e-commerce platform for authentic Indian pickles and spice powders, built with React and TypeScript.

## About

The Pickle Pot celebrates traditional Indian culinary heritage by offering premium pickles and artisanal spice powders. Our platform provides a seamless shopping experience with features like user authentication, shopping cart management, and comprehensive product catalogs.

## ✨ Features

### Core E-commerce Functionality

- **Product Catalogs**: Browse 8 varieties of pickles and 10 spice powder blends
- **Shopping Cart**: Add items with size selection, quantity control, and delivery date picker
- **User Authentication**: Secure login/signup with persistent sessions
- **Account Management**: Comprehensive user profiles with preferences and settings

### Advanced Features

- **Address Management**: Multiple shipping addresses with default settings
- **Payment Methods**: Support for multiple payment methods and cards
- **Promotional Codes**: Dynamic discount system (PICKLE25, WELCOME10, FREESHIP)
- **Search & Filter**: Product discovery with category and spice level filtering
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Content Pages

- **Our Story**: Heritage and traditional values showcase
- **FAQ**: Interactive help center with search functionality
- **Contact**: Business information and contact forms
- **Legal Pages**: Privacy policy and terms & conditions

## 🛠 Technology Stack

### Frontend

- **React 18** with TypeScript for type-safe development
- **React Router DOM** for client-side routing
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible component primitives
- **Framer Motion** for smooth animations
- **React Hook Form** for form management and validation

### Backend & Build Tools

- **Vite** for fast development and building
- **Express.js** for server-side functionality
- **Zod** for runtime type validation
- **SWC** for fast TypeScript compilation

### State Management

- **React Context** for global state (Cart & User)
- **localStorage** for data persistence
- **React Query** for server state management

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd the-pickle-pot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to the URL shown in your terminal (typically `http://localhost:5173`)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (client + server)
- `npm run build:client` - Build client-side application
- `npm run build:server` - Build server-side application
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run typecheck` - Type check TypeScript files
- `npm run format.fix` - Format code with Prettier

## 📁 Project Structure

```
code/
├── client/                 # Frontend application
│   ├── components/         # Reusable UI components
│   │   ├── Header.tsx      # Main navigation header
│   │   └── AddToCartDialog.tsx # Shopping cart modal
│   ├── context/           # Global state management
│   │   ├── CartContext.tsx # Shopping cart state
│   │   └── UserContext.tsx # User authentication state
│   ├── pages/             # Application pages/routes
│   │   ├── Index.tsx      # Homepage with featured products
│   │   ├── Pickles.tsx    # Pickles product catalog
│   │   ├── Powders.tsx    # Spice powders catalog
│   │   ├── Cart.tsx       # Shopping cart and checkout
│   │   ├── Auth.tsx       # Login/signup forms
│   │   ├── Account.tsx    # User profile management
│   │   ├── Contact.tsx    # Contact information
│   │   ├── OurStory.tsx   # Brand story and heritage
│   │   ├── FAQ.tsx        # Frequently asked questions
│   │   ├── PrivacyPolicy.tsx # Privacy policy
│   │   └── TermsConditions.tsx # Terms and conditions
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and helpers
│   ├── global.css         # Global styles and CSS variables
│   └── main.tsx           # Application entry point
├── server/                # Backend server code
├── shared/                # Shared utilities between client/server
├── public/                # Static assets
├── dist/                  # Build output directory
└── package.json           # Project dependencies and scripts
```

## 🎨 Design System

### Color Palette

The application uses a spice-inspired color scheme:

- **Turmeric**: Warm yellows (#F59E0B, #FEF3C7)
- **Paprika**: Rich reds (#DC2626, #FEE2E2)
- **Cumin**: Earthy browns (#92400E, #FED7AA)
- **Cardamom**: Soft greens (#059669, #D1FAE5)

### Typography

- **Primary Font**: Inter (clean, modern sans-serif)
- **Accent Font**: Custom font stack for headings

## 🔧 Development Guidelines

### Code Style

- **TypeScript**: Strict type checking enabled
- **Prettier**: Automatic code formatting
- **ESLint**: Code quality and consistency
- **Semantic HTML**: Accessible markup patterns

### Component Architecture

- **Atomic Design**: Components broken into meaningful abstractions
- **Context Providers**: Global state management
- **Custom Hooks**: Reusable logic extraction
- **Type Safety**: Comprehensive TypeScript coverage

### State Management

- **Local State**: useState for component-specific state
- **Global State**: Context API for cart and user data
- **Persistence**: localStorage for cross-session data
- **Server State**: React Query for API data management

## 🌟 Key Features Deep Dive

### Shopping Cart

- Persistent cart state across browser sessions
- Dynamic quantity and size selection
- Delivery date picker (2-30 days)
- Promotional code system with validation
- Real-time price calculations with tax and shipping

### User Authentication

- Secure login/signup with validation
- Profile management with preferences
- Multiple address and payment method support
- Privacy and notification settings

### Product Management

- Rich product data with ingredients and descriptions
- Multiple size options (6oz, 8oz bottles)
- Spice level indicators (Mild, Medium, Hot)
- Category-based filtering and search

## 📱 Responsive Design

The application is built mobile-first with responsive breakpoints:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🚀 Deployment

The application is configured for deployment on:

- **Netlify**: Using `netlify.toml` configuration
- **Node.js servers**: Production-ready Express server
- **Serverless platforms**: Serverless HTTP support included

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

1. Run `npm run dev` for development
2. Run `npm run typecheck` before committing
3. Run `npm run format.fix` to format code
4. Ensure all tests pass with `npm test`

## 📄 License

This project is private and proprietary.

## 📞 Contact

- **Email**: hello@thepicklepot.com
- **Phone**: +1 408 219 1573
- **Location**: San Jose, CA, USA

---

Built with ❤️ and a passion for authentic Indian flavors.
