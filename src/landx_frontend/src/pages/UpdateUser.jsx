'use client'

import React, { useState, useEffect } from 'react'



export default function UpdateUser({ userData, onSubmit }) {
  const [formData, setFormData] = useState(userData)

  useEffect(() => {
    setFormData(userData)
  }, [userData])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Modifier l'utilisateur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nom complet</label>
          <input 
            type="text" 
            id="fullName" 
            name="fullName" 
            value={formData.fullName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-700 focus:border-yellow-700 text-sm sm:text-base"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-700 focus:border-yellow-700 text-sm sm:text-base"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
            <input 
              type="tel" 
              id="phoneNumber" 
              name="phoneNumber" 
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-700 focus:border-yellow-700 text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
            <input 
              type="text" 
              id="address" 
              name="address" 
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-700 focus:border-yellow-700 text-sm sm:text-base"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">Numéro d'identification nationale</label>
            <input 
              type="text" 
              id="idNumber" 
              name="idNumber" 
              value={formData.idNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-700 focus:border-yellow-700 text-sm sm:text-base"
            />
          </div>
          <div>
            <label htmlFor="landTitle" className="block text-sm font-medium text-gray-700">Numéro de titre foncier</label>
            <input 
              type="text" 
              id="landTitle" 
              name="landTitle" 
              value={formData.landTitle}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-700 focus:border-yellow-700 text-sm sm:text-base"
            />
          </div>
        </div>
        <button type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-700"
        >
          Mettre à jour
        </button>
      </form>
    </div>
  )
}