# We Store

A self-storage facility website built with React and Tailwind CSS. Customers can reserve units, log
what they've stored, and pay rent online; managers get a full back-office to run the facility.

## Features

- **Two account types** — customer and facility manager, with role-aware routing and a shared login page.
- **Inventory management** — customers add, edit, and remove items in their own units; managers can do
  the same across every unit in the facility, with search and filtering by category/customer.
- **Unit management** — managers add/edit/delete units, set pricing and climate control, and assign or
  release customers. Customers browse available units and reserve one instantly.
- **Billing** — mock invoices per unit per month, with pay/mark-paid actions and overdue alerts.
- **Customer directory** — managers can look up any customer's units, inventory, and invoice history.
- **Account settings** — update profile info and password.

## Getting started

```bash
npm install
npm run dev
```

Data is seeded on first run and persisted to `localStorage` (no backend required). Demo accounts:

| Role     | Email                 | Password      |
| -------- | --------------------- | ------------- |
| Manager  | manager@westore.com   | manager123    |
| Customer | jane@example.com      | customer123   |

The login page has a "Fill demo credentials" shortcut for both roles.

## Stack

React 19 + Vite, React Router, Tailwind CSS v4, lucide-react icons.
