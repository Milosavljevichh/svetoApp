import Link from 'next/link'; // Import Link from Next.js for navigation

const Header = () => {
  return (
    <header className="bg-[#2c1810] text-white p-4">
      <nav className="flex items-center px-5">
        <div className="text-2xl font-crimson-text">
          <Link href="/" className="hover:text-[#8b4513]">
            Home
          </Link>
        </div>
        <div className="text-2xl font-crimson-text">
          <Link href="/DonatePage" className="hover:text-[#8b4513] m-4">
            Donate
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
