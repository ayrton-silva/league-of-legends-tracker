import { Link } from 'react-router-dom'

const navigationItems = [
  {
    title: 'Invocadores',
    href: '/summoners',
  },
  {
    title: 'Campeões',
    href: '/champions',
  },
]

export function Header() {
  return (
    <nav>
      <ul className="flex justify-center gap-4 py-4">
        {navigationItems.map((item) => (
          <li key={item.title}>
            <Link to={item.href}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
