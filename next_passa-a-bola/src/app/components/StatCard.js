// app/components/StatCard.js

export default function StatCard({ title, value }) {
    return (
        <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg">
            <p className="text-4xl font-bold text-white">{value}</p>
            <p className="text-gray-400 mt-2">{title}</p>
        </div>
    );
}