import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '@/app/providers/store'

// хук для dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

// хук для useSelector с типами
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector