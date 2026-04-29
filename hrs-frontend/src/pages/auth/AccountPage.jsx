import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile, changePassword } from '../../api/auth';

const AccountPage = () => {
    const { user, login } = useAuth(); // we'll use login to just update context if needed, or simply re-fetch /me
    const [loading, setLoading] = useState(false);
    const [pwdLoading, setPwdLoading] = useState(false);
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            phone: user?.phone || '',
        }
    });

    const { register: registerPwd, handleSubmit: handlePwdSubmit, formState: { errors: pwdErrors }, watch, reset: resetPwd } = useForm();
    const newPassword = watch('new_password');

    const onProfileSubmit = async (data) => {
        try {
            setLoading(true);
            const res = await updateProfile(data);
            toast.success("Profile updated!");
            // Quick update to context via localStorage bypass or re-fetch logic
            localStorage.setItem('user', JSON.stringify(res.data));
            window.dispatchEvent(new Event('auth-change'));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const onPasswordSubmit = async (data) => {
        try {
            setPwdLoading(true);
            await changePassword(data);
            toast.success("Password changed successfully!");
            resetPwd();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to change password");
        } finally {
            setPwdLoading(false);
        }
    };

    return (
        <div className="bg-neutral-light min-h-screen py-10 px-4">
            <div className="container mx-auto max-w-3xl">
                <h1 className="text-3xl font-bold text-text-primary mb-8">Account Settings</h1>
                
                <div className="bg-white rounded-lg shadow-sm border border-neutral p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4 border-b border-neutral pb-2">Personal Details</h2>
                    <form onSubmit={handleSubmit(onProfileSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">First Name</label>
                                <input type="text" {...register('first_name', { required: 'Required' })} className="w-full border border-neutral rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-secondary" />
                                {errors.first_name && <p className="text-error text-xs mt-1">{errors.first_name.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Last Name</label>
                                <input type="text" {...register('last_name', { required: 'Required' })} className="w-full border border-neutral rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-secondary" />
                                {errors.last_name && <p className="text-error text-xs mt-1">{errors.last_name.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Email <span className="text-xs text-gray-400">(cannot be changed)</span></label>
                                <input type="email" value={user?.email || ''} disabled className="w-full border border-neutral rounded px-3 py-2 bg-gray-100 text-text-secondary cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
                                <input type="text" {...register('phone')} className="w-full border border-neutral rounded px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-secondary" />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-secondary text-white rounded font-medium hover:bg-primary transition disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-neutral p-6">
                    <h2 className="text-xl font-bold mb-4 border-b border-neutral pb-2">Security</h2>
                    <form onSubmit={handlePwdSubmit(onPasswordSubmit)}>
                        <div className="space-y-4 mb-6 max-w-md">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Current Password</label>
                                <input type="password" {...registerPwd('current_password', { required: 'Required' })} className="w-full border border-neutral rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-secondary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
                                <input type="password" {...registerPwd('new_password', { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' } })} className="w-full border border-neutral rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-secondary" />
                                {pwdErrors.new_password && <p className="text-error text-xs mt-1">{pwdErrors.new_password.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Confirm New Password</label>
                                <input type="password" {...registerPwd('new_password_confirmation', { required: 'Required', validate: v => v === newPassword || 'Passwords do not match' })} className="w-full border border-neutral rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-secondary" />
                                {pwdErrors.new_password_confirmation && <p className="text-error text-xs mt-1">{pwdErrors.new_password_confirmation.message}</p>}
                            </div>
                        </div>
                        <button type="submit" disabled={pwdLoading} className="px-6 py-2 border border-primary text-primary rounded font-medium hover:bg-neutral transition disabled:opacity-50">
                            {pwdLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
