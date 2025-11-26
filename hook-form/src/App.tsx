import {useForm, type SubmitHandler} from "react-hook-form"
import './App.css'
import { useState } from "react";
type FormValues = {
  name: string
  email: string

}
function App() {
  const {register, handleSubmit} = useForm<FormValues>();
  const [output, setOutput] = useState('');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try{
        const response = await fetch('http://localhost:3000/api/post',{
          method: 'POST',
          headers: {
            'Content-type': 'Application/json'
          },
          body: JSON.stringify(data)
        })

        if(!response.ok){
          throw new Error ("Network meo")
        }
        const result = await response.json()
        setOutput(result)
    } catch (error){
      console.log(error, "deu ruim")
    }
  }

  return (
    <>
    <div className="h-screen w-full bg-gray-950 text-zinc-300 flex justify-center items-center flex-col ">
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
      <pre>{output}</pre>
    </div>
     
    </>
  )
}

export default App

