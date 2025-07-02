import React, { useState, useEffect } from "react";
import LayoutAdmin from "./LayoutAdmin";


export default function ScheduleMovies() {
    const [scheduledMovies, setScheduledMovies] = useState([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("scheduledMovies");
            const scheduled = stored ? JSON.parse(stored) : [];
            setScheduledMovies(scheduled);
        } catch (error) {
            console.error("Error loading scheduled movies:", error);
            setScheduledMovies([]);
        }
    }, []);


    const deleteMovie = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this movie?");
        if (!confirmDelete) return;

        try {
            const stored = localStorage.getItem("scheduledMovies");
            if (stored) {
                const scheduled = JSON.parse(stored);
                const updated = scheduled.filter(movie => movie._id !== id);
                localStorage.setItem("scheduledMovies", JSON.stringify(updated));
            }



            alert("Movie removed successfully!");

            setScheduledMovies(prev => prev.filter(movie => movie._id !== id)); // if you're using state

        } catch (error) {
            console.error("Delete movie error:", error);
            alert(error.message);
        }
    };


    return (
        <LayoutAdmin>
            <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Scheduled Movies ({scheduledMovies.length})</h2>
                {scheduledMovies.length === 0 ? (
                    <p>No movies scheduled.</p>
                ) : (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Title</th>
                                <th className="border p-2">Description</th>
                                <th className="border p-2">Showtimes</th>
                                <th className="border p-2">Image</th>
                                <th className="border p-2">Remove scheduled movie</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheduledMovies.map((movie) => (
                                <tr key={movie._id} className="text-center">
                                    <td className="border p-2">{movie.title}</td>
                                    <td className="border p-2">{movie.description}</td>
                                    <td className="border p-2">
                                        {Array.isArray(movie.showtimes) ? movie.showtimes.join(", ") : "N/A"}
                                    </td>
                                    <td className="border p-2">
                                        <img src={movie.imageURL} alt={movie.title} className="h-16 mx-auto" />
                                    </td>
                                    <td className="border p-2">
                                        <button
                                            onClick={() => deleteMovie(movie._id)}
                                            className="bg-red-600 text-black px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </LayoutAdmin>
    );
}
