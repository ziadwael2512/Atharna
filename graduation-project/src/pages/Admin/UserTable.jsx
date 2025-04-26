import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/User.css"; // استيراد ملف الـ CSS
import Sidebar from "../../components/Sidebar";
const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    // جلب البيانات من الـ API
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Unauthorized: No token found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/admin/users/getAllUsers", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error.response?.data || error.message);
                setError(error.response?.data?.message || "Error fetching data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // اختيار الصف عند الضغط عليه
    const handleRowClick = (userId) => {
        setSelectedRow(userId === selectedRow ? null : userId);
    };

    // تغيير دور المستخدم
    const handleChangeRole = async (userId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Unauthorized: No token found. Please log in.");
            return;
        }

        const userIdNumber = Number(userId); // تحويل الـ ID إلى رقم

        try {
            await axios.put(
                `http://localhost:5000/admin/users/${userIdNumber}/admin`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userIdNumber ? { ...user, type: "ADMIN" } : user
                )
            );
            alert("Role changed successfully!");
        } catch (error) {
            console.error("Error changing role:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Error changing role. Please try again later.");
        }
    };

    // حذف المستخدم
    const handleDeleteUser = async (userId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Unauthorized: No token found. Please log in.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this user?")) {
            const userIdNumber = Number(userId); // تحويل الـ ID إلى رقم

            try {
                await axios.delete(`http://localhost:5000/admin/users/${userIdNumber}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userIdNumber));
                alert("User deleted successfully!");
            } catch (error) {
                console.error("Error deleting user:", error.response?.data || error.message);
                setError(error.response?.data?.message || "Error deleting user. Please try again later.");
            }
        }
    };

    return (
        <div>
    <Sidebar />
        <div className="user-table-container">
            <h1>User List</h1>
            {loading ? (
                <p className="loading-message">Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className={selectedRow === user.id ? "selected" : ""}
                                onClick={() => handleRowClick(user.id)}
                            >
                                <td>{user.id}</td>
                                <td>{user.Fname}</td>
                                <td>{user.Lname}</td>
                                <td>{user.email}</td>
                                <td>{user.type}</td>
                                <td>
                                    <button
                                        className="action-button change-role-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleChangeRole(user.id);
                                        }}
                                    >
                                        Change Role
                                    </button>
                                    <button
                                        className="action-button delete-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteUser(user.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        </div>
    );
};

export default UserTable;
