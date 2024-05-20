import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { store } from '../src/store/store'
import { Provider } from 'react-redux'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Login } from './features/login/Login'
import { TodoLists } from './components/todoLists/TodoLists'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				element: <Navigate to='/todolists' />,
			},
			{
				path: '/login',
				element: <Login />,
			},
			{
				path: '/todolists',
				element: <TodoLists />,
			},
		],
	},
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>
)
