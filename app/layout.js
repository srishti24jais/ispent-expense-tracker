import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'ISpent - Track your expenses',
  description: 'A simple expense tracker application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 