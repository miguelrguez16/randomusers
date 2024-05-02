import { type User } from '../types';

interface Props {
	users: User[];
	showColor: boolean;
}

export const UserTable = ({ users, showColor }: Props) => {
	return (
		<table width="100%">
			<thead>
				<tr>
					<th>Foto</th>
					<th>Nombre</th>
					<th>Apellido</th>
					<th>Pais</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody className={showColor ? 'table--showColors' : ''}>
				{users?.map((user) => {
					return (
						<tr key={user.email}>
							<td>
								<img src={user.picture.thumbnail} />
							</td>
							<td>{user.name.first}</td>
							<td>{user.name.last}</td>
							<td>{user.location.country}</td>
							<td>
								<button>Borrar</button>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};
