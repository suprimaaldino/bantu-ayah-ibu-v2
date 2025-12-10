import React, { useState } from 'react';
import useSound from '../hooks/useSound';

const ParentDashboard = ({
  missions,
  // setMissions, -> REMOVED
  rewards,
  // setRewards, -> REMOVED
  pendingClaims,
  // setPendingClaims, -> REMOVED
  onApproveClaim,
  onRejectClaim,
  onExit,
  // NEW PROPS
  onSaveMission,
  onDeleteMission,
  onSaveReward,
  onDeleteReward,
  familyId,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState('approvals'); // approvals, missions, rewards
  const { playSound } = useSound();

  // Local state for forms
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Generic delete handler
  const handleDelete = (type, id) => {
    if (confirm('Yakin ingin menghapus item ini?')) {
      if (type === 'mission') {
        onDeleteMission(id);
      } else {
        onDeleteReward(id);
      }
      playSound('click');
    }
  };

  // Generic save handler
  const handleSave = (type, item) => {
    if (type === 'mission') {
      onSaveMission(item);
    } else {
      onSaveReward(item);
    }
    setIsEditing(false);
    setEditItem(null);
    playSound('success');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-4 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 mt-12 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mode Orang Tua 👨‍👩‍👧</h1>
          <p className="text-sm text-gray-500 font-bold">Kode Keluarga: <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-lg select-all">{familyId}</span></p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onLogout}
            className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 transition shadow-sm"
          >
            Keluar Keluarga
          </button>
          <button
            onClick={onExit}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition shadow-md"
          >
            Tutup Dashboard
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'approvals', label: 'Persetujuan', icon: '✅' },
          { id: 'missions', label: 'Atur Misi', icon: '📝' },
          { id: 'rewards', label: 'Atur Hadiah', icon: '🎁' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${activeTab === tab.id
              ? 'bg-purple-600 text-white shadow-md scale-105'
              : 'bg-white text-gray-600 border border-gray-200'
              }`}
          >
            <span>{tab.icon}</span>
            <span className="font-semibold">{tab.label}</span>
            {tab.id === 'approvals' && pendingClaims.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingClaims.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm p-4 min-h-[50vh]">
        {activeTab === 'approvals' && (
          <ApprovalsList
            claims={pendingClaims}
            missions={missions}
            rewards={rewards}
            onApprove={onApproveClaim}
            onReject={onRejectClaim}
          />
        )}

        {activeTab === 'missions' && (
          <MissionsManager
            missions={missions}
            onSave={(item) => handleSave('mission', item)}
            onDelete={(id) => handleDelete('mission', id)}
            setIsEditing={setIsEditing}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsManager
            rewards={rewards}
            onSave={(item) => handleSave('reward', item)}
            onDelete={(id) => handleDelete('reward', id)}
            setIsEditing={setIsEditing}
          />
        )}
      </div>
    </div>
  );
};

// Sub-components (Internal for now, can be split if large)

const ApprovalsList = ({ claims, missions, rewards, onApprove, onReject }) => {
  if (claims.length === 0) {
    return <EmptyState message="Tidak ada permintaan klaim saat ini." icon="👍" />;
  }

  return (
    <div className="space-y-4">
      {claims.map((claim) => {
        const isReward = claim.type === 'reward';
        const item = isReward
          ? rewards.find(r => r.id === claim.itemId)
          : missions.find(m => m.id === claim.itemId || m.id === claim.missionId);

        if (!item) return null;

        const quantity = claim.quantity || 1;
        const totalValue = isReward ? item.price * quantity : item.coins;

        return (
          <div key={claim.id} className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center bg-yellow-50 relative overflow-hidden">
            {/* Category Badge */}
            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${isReward ? 'bg-pink-500 text-white' : 'bg-blue-500 text-white'}`}>
              {isReward ? '🎁 Hadiah' : '🎯 Misi'}
            </div>

            <div className="text-4xl">{item.emoji}</div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-gray-800">
                {item.name} {quantity > 1 && <span className="text-purple-600 text-sm">(x{quantity})</span>}
              </h3>
              <div className="flex items-center gap-2 text-sm mt-1 justify-center sm:justify-start">
                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                  👤 {claim.childName || 'Anak'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{new Date(claim.timestamp).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div className={`font-bold mt-1 ${isReward ? 'text-red-500' : 'text-green-600'}`}>
                {isReward ? `-${totalValue} Koin` : `+${totalValue} Koin`}
                {quantity > 1 && isReward && <span className="text-xs text-gray-400 font-normal ml-1">({item.price} x {quantity})</span>}
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
              <button
                onClick={() => onReject(claim.id)}
                className="flex-1 sm:flex-none px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
              >
                Tolak
              </button>
              <button
                onClick={() => onApprove(claim)}
                className="flex-1 sm:flex-none px-6 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 shadow-md"
              >
                Setuju
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MissionsManager = ({ missions, onSave, onDelete, setIsEditing }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const openForm = (item = null) => {
    setEditingItem(item);
    setIsEditing(!!item);
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    return (
      <ItemForm
        type="mission"
        initialData={editingItem}
        onCancel={() => {
          setIsEditing(false);
          setIsFormOpen(false);
        }}
        onSave={(data) => {
          onSave(data);
          setIsEditing(false);
          setIsFormOpen(false);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-700">Daftar Misi</h3>
        <button onClick={() => openForm()} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-purple-700">
          + Tambah Misi
        </button>
      </div>

      <div className="space-y-3">
        {missions.map(mission => (
          <div key={mission.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{mission.emoji}</span>
              <div>
                <div className="font-bold text-gray-800">{mission.name}</div>
                <div className="text-xs text-gray-500 capitalize">{mission.difficulty} • {mission.coins} Koin</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openForm(mission)} className="text-blue-500 p-2 hover:bg-blue-50 rounded">✏️</button>
              <button onClick={() => onDelete(mission.id)} className="text-red-500 p-2 hover:bg-red-50 rounded">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RewardsManager = ({ rewards, onSave, onDelete, setIsEditing }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const openForm = (item = null) => {
    setEditingItem(item);
    setIsEditing(!!item);
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    return (
      <ItemForm
        type="reward"
        initialData={editingItem}
        onCancel={() => {
          setIsEditing(false);
          setIsFormOpen(false);
        }}
        onSave={(data) => {
          onSave(data);
          setIsEditing(false);
          setIsFormOpen(false);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-700">Daftar Hadiah</h3>
        <button onClick={() => openForm()} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-purple-700">
          + Tambah Hadiah
        </button>
      </div>

      <div className="space-y-3">
        {rewards.map(reward => (
          <div key={reward.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{reward.emoji}</span>
              <div>
                <div className="font-bold text-gray-800">{reward.name}</div>
                <div className="text-xs text-gray-500">{reward.price} Koin</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openForm(reward)} className="text-blue-500 p-2 hover:bg-blue-50 rounded">✏️</button>
              <button onClick={() => onDelete(reward.id)} className="text-red-500 p-2 hover:bg-red-50 rounded">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ItemForm = ({ type, initialData, onCancel, onSave }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    emoji: type === 'mission' ? '📝' : '🎁',
    coins: 5,
    price: 10,
    difficulty: 'Mudah'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-gray-800">{initialData ? 'Edit' : 'Tambah'} {type === 'mission' ? 'Misi' : 'Hadiah'}</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
        <input
          required
          className="w-full border rounded-lg p-2"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder={`Contoh: ${type === 'mission' ? 'Membersihkan Mainan' : 'Es Krim'}`}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Icon/Emoji</label>
          <input
            className="w-full border rounded-lg p-2 text-center"
            value={formData.emoji}
            onChange={e => setFormData({ ...formData, emoji: e.target.value })}
            placeholder="🎁"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">{type === 'mission' ? 'Koin (skor)' : 'Harga (koin)'}</label>
          <input
            type="number"
            required
            className="w-full border rounded-lg p-2"
            value={type === 'mission' ? formData.coins : formData.price}
            onChange={e => setFormData({
              ...formData,
              [type === 'mission' ? 'coins' : 'price']: parseInt(e.target.value) || 0
            })}
          />
        </div>
      </div>

      {type === 'mission' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kesulitan</label>
          <select
            className="w-full border rounded-lg p-2"
            value={formData.difficulty}
            onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
          >
            <option value="Mudah">Mudah</option>
            <option value="Sedang">Sedang</option>
            <option value="Sulit">Sulit</option>
          </select>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Batal</button>
        <button type="submit" className="flex-1 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700">Simpan</button>
      </div>
    </form>
  );
}

const EmptyState = ({ message, icon }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
    <span className="text-4xl mb-2 grayscale opacity-50">{icon}</span>
    <p>{message}</p>
  </div>
);

export default ParentDashboard;
