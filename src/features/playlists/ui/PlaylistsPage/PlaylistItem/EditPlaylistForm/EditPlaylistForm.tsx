// import {useUpdatePlaylistMutation} from '@/features/playlists/api/playlistsApi';
// import type {PlaylistData} from '@/features/playlists/api/playlistsApi.types';
// import s from '@/features/playlists/ui/PlaylistsPage/PlaylistsPage.module.css';
// import {type SubmitHandler, useForm} from 'react-hook-form'
//
// type UpdatePlaylistFormValues = {
//     title: string
//     description: string
// }
//
// type Props = {
//     playlist: PlaylistData
//     onCancelEdit: () => void
// }
//
// export const EditPlaylistForm = ({playlist, onCancelEdit}:Props) => {
//     const [updatePlaylist] = useUpdatePlaylistMutation()
//
//     const { register, handleSubmit } =
//         useForm<UpdatePlaylistFormValues>({
//             defaultValues: {
//                 title: playlist.attributes.title,
//                 description: playlist.attributes.description ?? ''
//             }
//         })
//
//     const onSubmit: SubmitHandler<UpdatePlaylistFormValues> = data => {
//         updatePlaylist({
//             playlistId: playlist.id,
//             body: {
//                 data: {
//                     type: 'playlists',
//                     attributes: {
//                         title: data.title,
//                         description: data.description,
//                         tagIds: playlist.attributes.tags.map(t => t.id)
//                     }
//                 }
//             }
//         }).then(onCancelEdit)
//     }
//     return (
//         <>
//             <form
//                 className={s.editForm}
//                 onSubmit={handleSubmit(onSubmit)}
//             >
//                 <input {...register('title')} />
//                 <input {...register('description')} />
//
//                 <div className={s.actions}>
//                     <button type="submit">Save</button>
//                     <button type="button" onClick={onCancelEdit}>
//                         Cancel
//                     </button>
//                 </div>
//             </form>
//         </>
//     );
// };
