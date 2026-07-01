// "use client";
// import { useEffect, useState } from 'react';
// import { 
//   Users,
//   Plus,
//   Edit2,
//   Trash2,
//   X,
//   Mail,
//   Lock,
//   User as UserIcon,
//   AlertCircle,
//   CheckCircle
// } from 'lucide-react';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   password?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function DashboardPage() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [formData, setFormData] = useState({ 
//     name: '', 
//     email: '', 
//     password: '' 
//   });

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/users');
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch users');
//       }

//       const data = await response.json();
//       setUsers(data);
//       setError('');
//     } catch (error) {
//       setError('Failed to load users');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleCreateUser = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
    
//     try {
//       const response = await fetch('/api/users', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to create user');
//       }

//       setSuccess('User created successfully!');
//       await fetchUsers();
//       setShowModal(false);
//       resetForm();
      
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to create user');
//       console.error(error);
//     }
//   };



//   const handleUpdateUser = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedUser) return;
//     setError('');
//     setSuccess('');

//     try {
//       const response = await fetch(`/api/users/${selectedUser.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           name: formData.name, 
//           email: formData.email 
//         })
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to update user');
//       }

//       setSuccess('User updated successfully!');
//       await fetchUsers();
//       setShowModal(false);
//       resetForm();
      
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to update user');
//       console.error(error);
//     }
//   };

//   const handleDeleteUser = async (userId: string) => {
//     if (!confirm('Are you sure you want to delete this user?')) return;

//     try {
//       const response = await fetch(`/api/users/${userId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete user');
//       }

//       setSuccess('User deleted successfully!');
//       await fetchUsers();
      
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (error) {
//       setError('Failed to delete user');
//       console.error(error);
//     }
//   };

//   const openCreateModal = () => {
//     setModalMode('create');
//     setSelectedUser(null);
//     resetForm();
//     setShowModal(true);
//   };

//   const openEditModal = (user: User) => {
//     setModalMode('edit');
//     setSelectedUser(user);
//     setFormData({ 
//       name: user.name, 
//       email: user.email, 
//       password: '' 
//     });
//     setShowModal(true);
//   };

//   const resetForm = () => {
//     setFormData({ name: '', email: '', password: '' });
//   };

//   return (
//     <div className="min-h-screen bg-[#F5F3EC]">
//       {/* Header */}
//       <header className="bg-white border-b border-[#E3DFD2] sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//             <div>
//               <h1 className="font-serif text-2xl sm:text-3xl text-[#221F1B]">
//                 User Management
//               </h1>
//               <p className="text-sm text-[#8A8473] mt-1">
//                 Create and manage users for your application
//               </p>
//             </div>
//             <button
//               onClick={openCreateModal}
//               className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-[#221F1B] text-white rounded-lg hover:bg-[#3A3530] transition-all duration-200 font-medium shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
//             >
//               <Plus className="h-5 w-5" />
//               Add New User
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//         {success && (
//           <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-200 flex items-start gap-3">
//             <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
//             <span>{success}</span>
//           </div>
//         )}
        
//         {error && (
//           <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200 flex items-start gap-3">
//             <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
//             <span>{error}</span>
//           </div>
//         )}

//         {/* Users List */}
//         <div className="bg-white rounded-2xl border border-[#E3DFD2] p-4 sm:p-6 shadow-[0_20px_50px_-20px_rgba(34,31,27,0.18)]">
//           {loading ? (
//             <div className="text-center py-12">
//               <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D97757] border-r-transparent"></div>
//               <p className="mt-2 text-sm text-[#8A8473]">Loading users...</p>
//             </div>
//           ) : users.length === 0 ? (
//             <div className="text-center py-16">
//               <Users className="h-16 w-16 text-[#8A8473] mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-[#221F1B]">No users yet</h3>
//               <p className="text-sm text-[#8A8473] mt-1">
//                 Click the "Add New User" button to create your first user
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[500px]">
//                 <thead>
//                   <tr className="border-b border-[#E3DFD2]">
//                     <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-[#8A8473] uppercase tracking-wider">
//                       User
//                     </th>
//                     <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-[#8A8473] uppercase tracking-wider">
//                       Email
//                     </th>
//                     <th className="hidden sm:table-cell text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-[#8A8473] uppercase tracking-wider">
//                       Created
//                     </th>
//                     <th className="text-right py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-[#8A8473] uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((user, index) => (
//                     <tr 
//                       key={index} 
//                       className="border-b border-[#F5F3EC] hover:bg-[#F5F3EC] transition-colors duration-150"
//                     >
//                       <td className="py-3 px-3 sm:px-4">
//                         <div className="flex items-center gap-3">
//                           <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#D97757] to-[#C7A24A] flex items-center justify-center text-white font-medium text-sm shadow-sm">
//                             {user.name.charAt(0).toUpperCase()}
//                           </div>
//                           <span className="font-medium text-[#221F1B] text-sm sm:text-base">
//                             {user.name}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="py-3 px-3 sm:px-4 text-sm text-[#403C34]">
//                         {user.email}
//                       </td>
//                       <td className="hidden sm:table-cell py-3 px-3 sm:px-4 text-sm text-[#8A8473]">
//                         {new Date(user.createdAt).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'short',
//                           day: 'numeric'
//                         })}
//                       </td>
//                       <td className="py-3 px-3 sm:px-4">
//                         <div className="flex items-center justify-end gap-1 sm:gap-2">
//                           <button
//                             onClick={() => openEditModal(user)}
//                             className="p-1.5 sm:p-2 text-[#8A8473] hover:text-[#221F1B] hover:bg-white rounded-lg transition-all duration-200 hover:shadow-sm"
//                             title="Edit user"
//                           >
//                             <Edit2 className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteUser(user.id)}
//                             className="p-1.5 sm:p-2 text-[#8A8473] hover:text-red-600 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-sm"
//                             title="Delete user"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* User Stats */}
//         {!loading && users.length > 0 && (
//           <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div className="bg-white rounded-xl border border-[#E3DFD2] p-4 hover:shadow-md transition-shadow duration-200">
//               <p className="text-sm text-[#8A8473]">Total Users</p>
//               <p className="font-serif text-2xl text-[#221F1B] mt-1">{users.length}</p>
//             </div>
//             <div className="bg-white rounded-xl border border-[#E3DFD2] p-4 hover:shadow-md transition-shadow duration-200">
//               <p className="text-sm text-[#8A8473]">Latest User</p>
//               <p className="font-medium text-[#221F1B] truncate mt-1">
//                 {users[0]?.name || 'N/A'}
//               </p>
//             </div>
//             <div className="bg-white rounded-xl border border-[#E3DFD2] p-4 hover:shadow-md transition-shadow duration-200">
//               <p className="text-sm text-[#8A8473]">Created Today</p>
//               <p className="font-serif text-2xl text-[#221F1B] mt-1">
//                 {users.filter(u => {
//                   const today = new Date().toDateString();
//                   return new Date(u.createdAt).toDateString() === today;
//                 }).length}
//               </p>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Create/Edit User Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl border border-[#E3DFD2] p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="font-serif text-2xl text-[#221F1B]">
//                 {modalMode === 'create' ? 'Add New User' : 'Edit User'}
//               </h3>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="p-2 hover:bg-[#F5F3EC] rounded-lg transition-colors"
//               >
//                 <X className="h-5 w-5 text-[#8A8473]" />
//               </button>
//             </div>

//             <form onSubmit={modalMode === 'create' ? handleCreateUser : handleUpdateUser}>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-[#403C34] mb-2">
//                     Full Name
//                   </label>
//                   <div className="relative">
//                     <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8A8473]" />
//                     <input
//                       type="text"
//                       required
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       className="w-full pl-10 pr-4 py-2.5 border border-[#E3DFD2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97757] focus:border-transparent transition-all duration-200"
//                       placeholder="John Doe"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-[#403C34] mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8A8473]" />
//                     <input
//                       type="email"
//                       required
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                       className="w-full pl-10 pr-4 py-2.5 border border-[#E3DFD2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97757] focus:border-transparent transition-all duration-200"
//                       placeholder="user@example.com"
//                     />
//                   </div>
//                 </div>

//                 {modalMode === 'create' && (
//                   <div>
//                     <label className="block text-sm font-medium text-[#403C34] mb-2">
//                       Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8A8473]" />
//                       <input
//                         type="password"
//                         required
//                         value={formData.password}
//                         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                         className="w-full pl-10 pr-4 py-2.5 border border-[#E3DFD2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97757] focus:border-transparent transition-all duration-200"
//                         placeholder="•••••••• (min 6 characters)"
//                         minLength={6}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {modalMode === 'edit' && (
//                   <div className="bg-[#F5F3EC] rounded-lg p-3 border border-[#E3DFD2]">
//                     <p className="text-sm text-[#8A8473] flex items-start gap-2">
//                       <AlertCircle className="h-4 w-4 text-[#D97757] flex-shrink-0 mt-0.5" />
//                       <span>
//                         <span className="font-medium">Note:</span> Password cannot be changed here.
//                         To reset password, delete and recreate the user.
//                       </span>
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="mt-6 flex flex-col sm:flex-row gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="flex-1 px-4 py-2.5 border border-[#E3DFD2] rounded-lg hover:bg-[#F5F3EC] transition-colors text-[#403C34] font-medium order-2 sm:order-1"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-4 py-2.5 bg-[#221F1B] text-white rounded-lg hover:bg-[#3A3530] transition-colors font-medium order-1 sm:order-2"
//                 >
//                   {modalMode === 'create' ? 'Create User' : 'Update User'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





"use client";
import { useEffect, useState } from 'react';
import { 
  Users,
  Plus,
  X,
  Mail,
  Lock,
  User as UserIcon,
  AlertCircle,
  CheckCircle,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      setError('');
    } catch (error) {
      setError('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }

      setSuccess('User created successfully!');
      await fetchUsers();
      setShowModal(false);
      resetForm();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create user');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedUser(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3EC] via-[#F5F3EC] to-[#EDEAE0]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#E3DFD2] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#D97757] to-[#C7A24A] flex items-center justify-center shadow-md">
                <Users className="h-5 w-5 text-black" />
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#221F1B] tracking-tight">
                  User Management
                </h1>
                <p className="text-sm text-[#8A8473] mt-0.5">
                  Create and manage users for your application
                </p>
              </div>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#221F1B] to-[#3A3530] text-black rounded-xl hover:shadow-lg transition-all duration-300 font-medium shadow-sm hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center"
            >
              <Plus className="h-5 w-5" />
              <span>Add New User</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 text-sm text-green-700 border border-green-200 flex items-start gap-3 shadow-sm">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{success}</span>
          </div>
        )}
        
        {error && (
          <div className="mb-6 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 p-4 text-sm text-red-600 border border-red-200 flex items-start gap-3 shadow-sm">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && users.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-[#E3DFD2] p-5 hover:shadow-lg transition-all duration-300 hover:border-[#D97757]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8A8473] font-medium">Total Users</p>
                  <p className="font-serif text-3xl text-[#221F1B] mt-1">{users.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-[#D97757]/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#D97757]" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E3DFD2] p-5 hover:shadow-lg transition-all duration-300 hover:border-[#D97757]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8A8473] font-medium">Latest User</p>
                  <p className="font-medium text-[#221F1B] truncate mt-1 text-lg">
                    {users[0]?.name || 'N/A'}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-[#8A9A7E]/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-[#8A9A7E]" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#E3DFD2] p-5 hover:shadow-lg transition-all duration-300 hover:border-[#D97757]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8A8473] font-medium">Created Today</p>
                  <p className="font-serif text-3xl text-[#221F1B] mt-1">
                    {users.filter(u => {
                      const today = new Date().toDateString();
                      return new Date(u.createdAt).toDateString() === today;
                    }).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-[#C7A24A]/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-[#C7A24A]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="bg-white rounded-2xl border border-[#E3DFD2] p-4 sm:p-6 shadow-xl shadow-[#221F1B]/5">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#D97757] border-r-transparent"></div>
              <p className="mt-3 text-sm text-[#8A8473] font-medium">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20">
              <div className="h-20 w-20 rounded-full bg-[#F5F3EC] flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-[#8A8473]" />
              </div>
              <h3 className="text-xl font-serif text-[#221F1B]">No users yet</h3>
              <p className="text-sm text-[#8A8473] mt-2 max-w-sm mx-auto">
                Click the "Add New User" button to create your first user and start managing your application
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#E3DFD2]">
                    <th className="text-left py-4 px-4 text-xs font-semibold text-[#8A8473] uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-[#8A8473] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="hidden md:table-cell text-left py-4 px-4 text-xs font-semibold text-[#8A8473] uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-[#F5F3EC] hover:bg-[#FBF9F6] transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#D97757] to-[#C7A24A] flex items-center justify-center text-black font-medium text-sm shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-[#221F1B]">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-[#8A8473]" />
                          <span className="text-[#403C34]">{user.email}</span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#8A8473]" />
                          <span className="text-sm text-[#8A8473]">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Note */}
        {!loading && users.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xs text-[#8A8473]">
              Showing {users.length} user{users.length !== 1 ? 's' : ''} in total
            </p>
          </div>
        )}
      </main>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#E3DFD2] p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#D97757] to-[#C7A24A] flex items-center justify-center shadow-md">
                  <UserIcon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-2xl text-[#221F1B]">
                  Add New User
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-[#F5F3EC] rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-[#8A8473]" />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#403C34] mb-2">
                    Full Name
                  </label>
                  <div className="relative group">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8A8473] group-focus-within:text-[#D97757] transition-colors duration-200" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-[#E3DFD2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] transition-all duration-200 bg-[#FBF9F6]"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#403C34] mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8A8473] group-focus-within:text-[#D97757] transition-colors duration-200" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-[#E3DFD2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] transition-all duration-200 bg-[#FBF9F6]"
                      placeholder="user@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#403C34] mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8A8473] group-focus-within:text-[#D97757] transition-colors duration-200" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-[#E3DFD2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] transition-all duration-200 bg-[#FBF9F6]"
                      placeholder="•••••••• (min 6 characters)"
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-[#E3DFD2] rounded-xl hover:bg-[#F5F3EC] transition-colors text-[#403C34] font-medium order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#221F1B] to-[#3A3530]  rounded-xl hover:shadow-lg transition-all duration-300 font-medium hover:scale-[1.02] active:scale-[0.98] order-1 sm:order-2"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}