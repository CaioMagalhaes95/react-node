import {useForm, type SubmitHandler} from "react-hook-form"
import './App.css'
import { useState, useEffect } from "react";
type FormValues = {
  id?: number
  name: string
  email: string

}
function App() {
  const {register, handleSubmit} = useForm<FormValues>();
  const [output, setOutput] = useState<any>('');
  const [data, setData] = useState<FormValues[]>([]);
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/get');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result: FormValues[] = await response.json();
      console.log('fetched rows:', result);
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try{
        const response = await fetch('http://localhost:3000/api/post',{
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data)
        })

        if(!response.ok){
          throw new Error ("Network meo")
        }
        const result = await response.json()
        setOutput(result)
        alert("Saved")
        await fetchData();
        
    } catch (error){
      console.log(error, "deu ruim")
    }
  }

  async function delteItem(id: number | undefined) {
    try {
      if (id === undefined) {
        console.error('Missing id for delete');
        return;
      }
      const response = await fetch(`http://localhost:3000/api/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        // try to read error body for debugging (server may send JSON)
        const text = await response.text().catch(() => null);
        try {
          const parsed = text ? JSON.parse(text) : text;
          console.error('Delete failed:', response.status, parsed);
        } catch (e) {
          console.error('Delete failed:', response.status, text);
        }
        return;
      }
      const result = await response.json();
      setOutput(result);
      alert("Deleted")
      await fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);

        }
      };

  return (
    <>
    <div className="h-screen w-full bg-gray-950 text-zinc-300 flex items-center flex-col ">
      <form 
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="">nome</label>
          <input
          type="text"
          className="border border-zinc-200 shadow-sm rounded h-10 px-4"
          {...register('name')}
          
          />
          </div>
          <div className="flex flex-col gap-1">
          <label htmlFor="">email</label>
          <input
          type="email"
          className="border border-zinc-200 shadow-sm rounded h-10 px-4"
          {...register('email')}
          />
          </div>
          <button className="bg-emerald-500 h-8 hover:bg-emerald-600 rounded px-4">Salvar</button>
        

      </form>
    

      <div>
        <table className="mt-10 border-collapse border border-gray-400 w-full max-w-lg ">
          <thead>
            <tr className="bg-gray-700 text-white p-4 m-4 px-4 rounded h-5 gap-1">
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id ?? item.email} className="bg-gray-300 text-black align-center justify-center p-4 m-4 px-4 rounded">
                <td className="border p-2 m-4 gap-2 ">{item.id ?? '-'}</td>
                <td className="border p-2 m-4 gap-2 ">{item.name}</td> 
                <td className="border p-2 m-4 gap-2 ">{item.email}</td>
                <td className="border p-2 m-4 gap-2 ">
                  <button 
                  onClick={() => delteItem(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
     
    </>
  )
}

export default App

