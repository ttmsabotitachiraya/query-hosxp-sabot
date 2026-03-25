import { Link } from 'react-router-dom';

interface HeaderProps {
  title: string;
  navLink: { to: string; label: string };
}

export default function Header({ title, navLink }: HeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      <nav>
        <Link to={navLink.to}>{navLink.label}</Link>
      </nav>
    </header>
  );
}
