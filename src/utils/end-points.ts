
export const endPoints = {
  nextbackend: import.meta.env.VITE_API_NEXT_backend || "",
  mlBackend: import.meta.env.VITE_API_ML_Backend || "",
} as const
