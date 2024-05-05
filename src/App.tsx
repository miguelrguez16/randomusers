import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { UserTable } from './components/UsersTable';
import { SORTBY, type User } from './types.d';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const anotherWay = async (page: number): Promise<[Error?, User[]?]> => {
	try {
		const {
			data: { results },
		} = await axios.get(`https://randomuser.me/api/?seed=mrg&results=10&page=${page}`);
		return [undefined, results];
	} catch (e) {
		if (e instanceof AxiosError) return [e, undefined];
		return [new Error('unkown error'), undefined];
	}
};

const fetchUsers = async (page: number) => {
	return await axios
		.get(`https://randomuser.me/api/?seed=mrg&results=10&page=${page}`)
		.then((response: AxiosResponse) => response.data.result);
};

const App = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [showColors, setShowColors] = useState(false);
	const [sorting, setSorting] = useState<SORTBY>(SORTBY.NONE);
	const [filterCountry, setFilterCountry] = useState<string | null>(null);
	const originalUsers = useRef<User[]>();
	// useRef para guardar un valor que queremos que se comparta entre renderizados
	// pero que al cambiar, no vuelva a renderizar el componente
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		setLoading(true);

		fetchUsers(currentPage)
			.then((response) => {
				setUsers((prevUsers) => prevUsers.concat(response));
				originalUsers.current = originalUsers.current?.concat(response.data.results);
			})
			.catch((err: AxiosError) => {
				setError(true);
				console.log('Error fetching users', err.cause);
			})
			.finally(() => setLoading(false));
	}, [currentPage]);

	const toggleColors = () => setShowColors((previousValue) => !previousValue);

	const toggleSort = () => {
		const newSortingValue = sorting === SORTBY.NONE ? SORTBY.COUNTRY : SORTBY.NONE;
		setSorting(newSortingValue);
	};

	const handleDelete = (uuid: string) => {
		const filteredUsers = users.filter((user) => user.login.uuid !== uuid);
		setUsers(filteredUsers);
	};

	const handleReset = () => {
		if (originalUsers.current) setUsers(originalUsers.current);
	};

	const handleChangeSort = (newSortBy: SORTBY) => setSorting(newSortBy);

	// const notCorrectSortedUsers = shortByCountry ?
	// users.sort((userA, userB) => { EL SORT MUTA EL ESTADO ORIGINAL NO SE PUEDE VOLVER A TOCAR
	// [...users].sort((userA, userB) => { MEJOR UNA COPIA
	// 	return userA.location.country.localeCompare(userB.location.country);
	// }) : users;

	const filteredUsers = useMemo(() => {
		return filterCountry != null && filterCountry.length > 0
			? users.filter((user) => user.location.country.toLowerCase().includes(filterCountry.toLowerCase()))
			: users;
	}, [users, filterCountry]);

	const sortedUsers = useMemo(() => {
		if (sorting === SORTBY.NONE) return filteredUsers;

		const compareProperties: Record<string, (user: User) => string> = {
			[SORTBY.COUNTRY]: (user) => user.location.country,
			[SORTBY.NAME]: (user) => user.name.first,
			[SORTBY.LAST]: (user) => user.name.last,
		};

		return filteredUsers.toSorted((a, b) => {
			const extractProperty = compareProperties[sorting];
			return extractProperty(a).localeCompare(extractProperty(b));
		});
	}, [filteredUsers, sorting]);

	return (
		<div className="App">
			<header>
				<h1>Prueba Random Users</h1>
			</header>
			{users && (
				<div className="align-buttons">
					<button onClick={toggleColors}>Cambiar Color</button>
					<button onClick={toggleSort}>Ordenar Por Pais</button>
					<button onClick={() => handleReset()}>Resetear</button>
					<input placeholder="Filtra por pais" onChange={(e) => setFilterCountry(e.target.value)} />
					<button onClick={() => {}}>Buscar por pais</button>
				</div>
			)}
			<main>
				{users.length > 0 && (
					<>
						<UserTable
							handleChangeSort={handleChangeSort}
							users={sortedUsers}
							showColor={showColors}
							deleteUser={handleDelete}
						/>
						<button onClick={() => setCurrentPage((prevValue) => prevValue + 1)}>
							Cargar más resultados
						</button>
					</>
				)}
				{loading && <p>Cargando ...</p>}
				{error && <p>Ha habido un error</p>}
				{!loading && !error && users.length === 0 && <p>No hay usuarios</p>}
			</main>
		</div>
	);
};

export default App;
