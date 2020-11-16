import React, {useState} from 'react'
import TodoBox from '../components/TodoBox/TodoBox';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import shortid from "shortid";

const TodosQuery = gql`{
    todos {
        id
        completed
        name
    }
}`

const AddTODO = gql`
  mutation createTodo($id: ID!, $name: String!, $completed: Boolean!){
    createTodo(todo : {id: $id, name: $name, completed: $completed}){
        id
        name
        completed 
    }
}
`

const RemoveTodo = gql`
    mutation deleteTodo($id: ID!){
        deleteTodo(id: $id)
}
`

const UpdateTodo = gql`
    mutation updateTodo($id: ID!, $name: String!, $completed: Boolean!){
        updateTodo(todo: {id: $id, name: $name, completed: $completed}){
            id
            name
            completed 
        }
    }
`


const index = () => {
    const [reminder, setterReminder] = useState<string>("");
    const [sendLoading, setLoading] = useState(false);
    const { loading, error, data } = useQuery(TodosQuery);
    const [addTodo] = useMutation(AddTODO);
    const [removeTodo] = useMutation(RemoveTodo);
    const [updateTodo] = useMutation(UpdateTodo);

    console.log(data);

    if(loading)
        return "loading.....";

    const Submit = () => {
        setLoading(true);
        addTodo({
            variables : {
                id : shortid.generate(),
                name : reminder,
                completed: false
            },
            refetchQueries: [{query:TodosQuery}],
        })
        setterReminder("");
        setLoading(false);
    }

    const onDelete = (id: any) => {
        removeTodo({
            variables : {
                id : id
            },
            refetchQueries: [{query:TodosQuery}],
        })
    }

    const onUpdate = (id: any, name:any, completed: any) => {
        updateTodo({
            variables : {
                id : id,
                name: name,
                completed: !completed
            },
            refetchQueries: [{query:TodosQuery}],
        })
    }

    return (
        <div className="App">
            <div className="box">
                <input type="text" className="input" placeholder="Reminder" value={reminder} name="reminder" onChange={({target}) => setterReminder(target.value)}/>
                <button className="submit__button" onClick={Submit}>
                    {!sendLoading ? "Add" : "Loading"}
                </button>
                <ul className="lists">
                    {
                    data.todos.length > 0 &&
                    data.todos.map(rem => (
                    <TodoBox
                        id={rem.id}
                        key={rem.id}
                        del={onDelete}
                        title={rem.name}
                        update={onUpdate}
                        completed={rem.completed}
                        />
                    ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default index