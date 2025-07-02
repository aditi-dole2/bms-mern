import React, { useState, useEffect } from "react";
import LayoutAdmin from "./LayoutAdmin";
import { useNavigate } from "react-router-dom"; 

export default function GetAllUsers() {
  const history = useNavigate(); 
  const navigate = useNavigate();

  const handleReturnToDashboard = () => {
    history("/dashboard") // Navigate to the dashboard
  };
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/getAllUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch Users.");
      }

      const data = await response.json();
      console.log("Fetched Users:", data);
      setUsers(data.users);
    } catch (error) {
      console.error("Get Users error:", error);
      alert(error.message);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this User?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/admin/deleteUser/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete User.");
      }

      alert("User deleted successfully!");
      getAllUsers();
    } catch (error) {
      console.error("Delete User error:", error);
      alert(error.message);
    }
  };

  return (
    <LayoutAdmin>
      <div className="border rounded p-4 max-w-6xl mx-auto text-black bg-white mt-5">
        <h2 className="text-2xl font-bold mb-4 text-center">All Users</h2>
        {users === 0 ? (
          <p className="text-center">No users found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Bookings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>
                    <button
  className="btn btn-primary btn-sm"
  onClick={() => navigate(`/getBookingsofAnyUser/${user._id}`)}
>
  View Bookings
</button>
</td>

                    <td>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <button 
        onClick={handleReturnToDashboard} 
        className="btn btn-primary mt-4"
      >
        Return to Dashboard
      </button>
    </LayoutAdmin>
  );
}
