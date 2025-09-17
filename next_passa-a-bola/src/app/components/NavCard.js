// app/components/NavCard.js
import Link from 'next/link';

export default function NavCard({ href, title, description }) {
    return (
        <Link 
            href={href} 
            className="block bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
        >
            <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </Link>
    );
}