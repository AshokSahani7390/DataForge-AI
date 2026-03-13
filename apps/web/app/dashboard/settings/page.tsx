export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
      <p className="text-gray-400">Manage your profile, security preferences, and global notifications.</p>
      
      <div className="max-w-2xl space-y-8 pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Profile Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors" defaultValue="Data Architect" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors" defaultValue="architect@dataforge-ai.com" />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button className="bg-gradient-premium px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,112,243,0.3)] transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
