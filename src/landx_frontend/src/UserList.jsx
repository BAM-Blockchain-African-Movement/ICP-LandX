'use client'

import React, { useState } from 'react'
import AuthPage from './AuthPage'
import UpdateUser from './UpdateUser'
import DataTable from '../components/Tables/DataTable'
import Modal from '../components/Modal'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'fullName', label: 'Nom complet' },
  { key: 'email', label: 'Email' },
  { key: 'phoneNumber', label: 'Numéro de téléphone' },
  { key: 'landTitle', label: 'Numéro de titre foncier' },
]

const initialData = [
  { id: 1, fullName: 'Jean Dupont', email: 'jean@example.com', phoneNumber: '0123456789', landTitle: 'TF12345', address: '123 Rue de Paris', idNumber: 'ID12345' },
  { id: 2, fullName: 'Marie Martin', email: 'marie@example.com', phoneNumber: '0987654321', landTitle: 'TF67890', address: '456 Avenue de Lyon', idNumber: 'ID67890' },
]

export default function UserList() {
  const [data, setData] = useState(initialData)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const handleDelete = (id) => {
    setData(data.filter(item => item.id !== id))
    setIsDeleteModalOpen(false)
  }

  const handleUpdate = (updatedUser) => {
    setData(data.map(item => item.id === updatedUser.id ? updatedUser : item))
    setIsUpdateModalOpen(false)
  }

  const handleCreate = (newUser) => {
    setData([...data, { ...newUser, id: data.length + 1 }])
    setIsCreateModalOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Liste des propriétaires terriens</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-600"
        >
          Créer un utilisateur
        </button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        itemsPerPage={5}
        onDelete={(id) => {
          setSelectedUser(data.find(item => item.id === id))
          setIsDeleteModalOpen(true)
        }}
        onUpdate={(id) => {
          setSelectedUser(data.find(item => item.id === id))
          setIsUpdateModalOpen(true)
        }}
      />
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <AuthPage isLogin={false} onSubmit={handleCreate} />
      </Modal>
      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
        {selectedUser && (
          <UpdateUser
            userData={selectedUser}
            onSubmit={handleUpdate}
          />
        )}
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
          <p className="mb-4">Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              onClick={() => handleDelete(selectedUser.id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}