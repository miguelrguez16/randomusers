import { SORTBY, type User } from '../types.d';

interface Props {
	users: User[];
	showColor: boolean;
	deleteUser: (uuid: string) => void;
	handleChangeSort: (newSort: SORTBY) => void;
}

export const UserTable = ({ users, showColor, deleteUser, handleChangeSort }: Props) => {
	return (
		<table width="100%">
			<thead>
				<tr>
					<th className="pointer" onClick={() => handleChangeSort(SORTBY.NONE)}>
						Foto
					</th>
					<th className="pointer" onClick={() => handleChangeSort(SORTBY.NAME)}>
						Nombre
					</th>
					<th className="pointer" onClick={() => handleChangeSort(SORTBY.LAST)}>
						Apellido
					</th>
					<th className="pointer" onClick={() => handleChangeSort(SORTBY.COUNTRY)}>
						Pais
					</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody className={showColor ? 'table--showColors' : ''}>
				{users?.map((user) => {
					return (
						<tr key={user.login.uuid}>
							<td>
								<img src={user.picture.thumbnail} />
							</td>
							<td>{user.name.first}</td>
							<td>{user.name.last}</td>
							<td>{user.location.country}</td>
							<td>
								{' '}
								<button onClick={() => deleteUser(user.login.uuid)}>Borrar</button>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};
