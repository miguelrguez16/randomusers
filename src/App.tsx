import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { Spinner } from './assets/Spinner';
import { UserTable } from './components/UsersTable';
import { type User } from './types.d';

const App = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [showColors, setShowColors] = useState(false);
	const [sortByCountry, setSortByCounty] = useState(false);
	const [filterCountry, setFilterCountry] = useState<string | null>(null);
	const originalUsers = useRef<User[]>();
	// useRef para guardar un valor
	// que queremos que se comparta entre renderizados
	// pero que al cambiar, no vuelva a renderizar el componente

	useEffect(() => {
		fetch('https://randomuser.me/api/?results=100')
			.then(async (res) => await res.json())
			.then((json) => {
				setUsers(json.results);
				originalUsers.current = json.results;
			})
			.catch((e) => console.error(e));
	}, []);

	const toggleColors = () => setShowColors(!showColors);

	const handleDelete = (uuid: string) => {
		const filteredUsers = users.filter((user) => user.login.uuid !== uuid);
		setUsers(filteredUsers);
	};

	const handleReset = () => {
		if (originalUsers.current) setUsers(originalUsers.current);
	};

	// const notCorrectSortedUsers = shortByCountry ?
	// users.sort((userA, userB) => { EL SORT MUTA EL ESTADO ORIGINAL NO SE PUEDE VOLVER A TOCAR
	// 	return userA.location.country.localeCompare(userB.location.country);
	// }) : users;

	// const notCorrectSortedUsers = shortByCountry ?
	// [...users].sort((userA, userB) => { MEJOR UNA COPIA
	// 	return userA.location.country.localeCompare(userB.location.country);
	// }) : users;

	const filteredUsers = useMemo(() => {
		console.log('calculate filteredUsers');
		return filterCountry != null && filterCountry.length > 0
			? users.filter((user) => user.location.country.toLowerCase().includes(filterCountry.toLowerCase()))
			: users;
	}, [users, filterCountry]);

	const sortedUsers = useMemo(() => {
		console.log('calculate SortedUsers');
		return sortByCountry
			? filteredUsers.toSorted((a, b) => a.location.country.localeCompare(b.location.country))
			: filteredUsers;
	}, [filteredUsers, sortByCountry]);

	return (
		<div className="App">
			<header>
				<h1>Prueba Random Users</h1>
			</header>
			<div className="align-buttons">
				<button onClick={toggleColors}>Cambiar Color</button>
				<button onClick={() => setSortByCounty((val) => !val)}>Ordenar Por Pais</button>
				<button onClick={() => handleReset()}>Resetear</button>
				<input placeholder="Filtra por pais" onChange={(e) => setFilterCountry(e.target.value)} />
				<button onClick={() => {}}>Buscar por pais</button>
			</div>
			<main>
				{users && <UserTable users={sortedUsers} showColor={showColors} deleteUser={handleDelete} />}
				{!users && <Spinner />}
			</main>
		</div>
	);
};

export default App;
