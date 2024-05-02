import React from 'react';
import './App.css';
import { Spinner } from './assets/Spinner';
import { UserTable } from './components/UsersTable';
import { type User } from './types.d';

const App = () => {
	const [data, setData] = React.useState<User[]>();
	const [showColors, setShowColors] = React.useState(false);

	React.useEffect(() => {
		fetch('https://randomuser.me/api/?results=100')
			.then(async (res) => await res.json())
			.then((json) => setData(json.results))
			.catch((e) => console.error(e));
	}, []);

	const toggleColors = () => setShowColors(!showColors);

	return (
		<div className="App">
			<header>
				<h1>Prueba de Random Users</h1>
				<button onClick={toggleColors}>Cambiar Color</button>
			</header>
			<main>
				{data && <UserTable users={data} showColor={showColors} />}
				{!data && <Spinner />}
			</main>
		</div>
	);
};

export default App;
