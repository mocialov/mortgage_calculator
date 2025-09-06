import { useState, useEffect } from 'react'

/**
 * Custom hook for persisting state in localStorage
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - The default value if no saved data exists
 * @returns {[any, function]} - [currentValue, setValue]
 */
export function useLocalStorage(key, defaultValue) {
  // Initialize state with a function to avoid calling localStorage on every render
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  })

  // Save to localStorage whenever value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Error saving to localStorage key "${key}":`, error)
    }
  }, [key, value])

  return [value, setValue]
}

/**
 * Hook for managing multiple related localStorage values
 * @param {Object} initialValues - Object with keys and their default values
 * @param {string} prefix - Optional prefix for localStorage keys
 * @returns {Object} - Object with current values and setter functions
 */
export function useLocalStorageState(initialValues, prefix = 'mortgage_calculator_') {
  const state = {}
  const setters = {}

  Object.entries(initialValues).forEach(([key, defaultValue]) => {
    const [value, setValue] = useLocalStorage(`${prefix}${key}`, defaultValue)
    state[key] = value
    setters[`set${key.charAt(0).toUpperCase() + key.slice(1)}`] = setValue
  })

  return { ...state, ...setters }
}
