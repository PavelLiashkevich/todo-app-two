import './style.css'
import errorPng from './error404.png'

export const ErrorPage = () => {
	return (
		<div className='error-404-section section-padding'>
			<div className='error'>
				<img src={errorPng} alt='Error' />
			</div>
			<div className='error-message'>
				<h3>Ой! Страница не найдена!</h3>
				<p>
					К сожалению мы не можем найти запрошенную вами страницу. Возможно, вы
					неправильно ввели адрес.
				</p>
				<a href='javascript:history.back()' className='theme-btn'>
					Вернуться назад
				</a>
			</div>
		</div>
	)
}
