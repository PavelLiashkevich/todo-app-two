import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Login } from './features/auth/ui/Login'
import { TodoLists } from './common/components/todoLists/TodoLists'
import ErrorPage from './common/components/errorPage/ErrorPage'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		errorElement: <ErrorPage />,
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
