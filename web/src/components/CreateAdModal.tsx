import * as Dialog from '@radix-ui/react-dialog';
import * as CheckBox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Check, GameController, CaretDown } from 'phosphor-react';
import { Input } from './Form/Input';
import { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';

interface IGame {
  id: string;
  title: string;
}

export function CreateAdModal() {
  const [games, setGames] = useState<IGame[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([])
  const [useVoiceChannel, setUseVoiceChannel] = useState<boolean>(false)

  useEffect(() => {
    axios('http://localhost:3333/games').then(response => {
      setGames(response.data)
    })
  }, [])

  async function handleCreateAd(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData(e?.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    if(!data.name) return;
    try {
      await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        useVoiceChannel: useVoiceChannel
      })
      alert('Sucesso')
    }catch (err) {
      alert('Erro!')
    }
    
  }

  return(
    <Dialog.Portal>
      <Dialog.DialogOverlay className='bg-black/60 inset-0 fixed' />

      <Dialog.DialogContent className='fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded w-[480px] shadow-lg shadow-black/25'>
        <Dialog.DialogTitle className='text-3xl text-white font-black'>Publique um anúncio</Dialog.DialogTitle>

        <form onSubmit={handleCreateAd} className='mt-6 flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='game' className='font-semibold'>Qual o game?</label>
            <select
              name='game'
              id='game'
              className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none'
              defaultValue=""
            >
              <option disabled value=""> Selecione o game</option>

              {
                games.map((game) => <option key={game.id} value={game.id}>{game.title}</option>)
              }
            </select>
            {/* <Select.Root>
              <Select.Trigger name='game' className='bg-zinc-900 py-3 px-4 rounded text-sm flex justify-between items-center gap-2'>
                <Select.Value placeholder="Selecione o game que deseja jogar" className=''/>
                <Select.Icon className='text-zinc-400'>
                  <CaretDown size={18}/>
                </Select.Icon>
              </Select.Trigger>

              <Select.Portal>
                <Select.Content className='bg-zinc-900 py-4 px-2 rounded-lg text-sm z-10 text-white tex-md'>
                  <Select.ScrollUpButton />
                  <Select.Viewport>
                    {
                      games.map((game) => (
                        <Select.Item value={game.id} key={game.id} className='hover:bg-zinc-500 rounded px-5 py-1'>
                          <Select.ItemText>{game.title}</Select.ItemText>
                        </Select.Item>
                      ))
                    }
                    
                  </Select.Viewport>
                  <Select.ScrollDownButton />
                </Select.Content>
              </Select.Portal>
            </Select.Root> */}
          </div>

          <div className='flex flex-col gap-6'>
            <label htmlFor='name'>Seu nome (ou nickname)</label>
            <Input name='name' id='name' type="text" placeholder='Como te chamam dentro do game?'/>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <label htmlFor='yearsPlaying'>Joga há quantos anos?</label>
              <Input name='yearsPlaying' id='yearsPlaying' type="text" placeholder='Tudo bem ser ZERO'/>
            </div>
            <div className='flex flex-col'>
              <label htmlFor='discord'>Qual seu Discord?</label>
              <Input name='discord' id='discord' type="text" placeholder='Usuario#0000'/>
            </div>
          </div>
          <div className='flex gap-6'>
            <div className='flex flex-col gap-6'>
              <label htmlFor='weekDays'>Quando costuma jogar?</label>

              <ToggleGroup.Root
                onValueChange={setWeekDays}
                value={weekDays}
                type='multiple' 
                className='grid grid-cols-4 gap-4'
              >
                <ToggleGroup.Item 
                  value='0' 
                  title='Domingo' 
                  className={`w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >D</ToggleGroup.Item>
                <ToggleGroup.Item 
                  value='1' 
                  title='Segunda' 
                  className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('1') && 'bg-violet-500'}`}
                >S</ToggleGroup.Item>
                <ToggleGroup.Item 
                  value='2' 
                  title='Terça' 
                  className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('2') && 'bg-violet-500'}`}
                >T</ToggleGroup.Item>
                <ToggleGroup.Item 
                  value='3' 
                  title='Quarta' 
                  className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('3') && 'bg-violet-500'}`}
                >Q</ToggleGroup.Item>
                <ToggleGroup.Item 
                  value='4' 
                  title='Quinta' 
                  className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('4') && 'bg-violet-500'}`}
                >Q</ToggleGroup.Item>
                <ToggleGroup.Item 
                  value='5' 
                  title='Sexta' 
                  className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('5') && 'bg-violet-500'}`}
                >S</ToggleGroup.Item>
                <ToggleGroup.Item 
                  value='6' 
                  title='Sábado' 
                  className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('6') && 'bg-violet-500'}`}
                >S</ToggleGroup.Item>
              </ToggleGroup.Root>

            </div>
            <div className='flex flex-col gap-6 flex-1'>
              <label htmlFor='hourStart'>Qual horário do dia?</label>
              <div className='grid grid-cols-2 gap-2'>
                <Input name='hourStart' id='hourStart' type="time" placeholder='De'/>
                <Input name='hourEnd' id='hourEnd' type="time" placeholder='Até'/>
              </div>
            </div>
          </div>

          <label className='mt-2 flex gap-2 text-sm items-center'>
            <CheckBox.Root checked={useVoiceChannel} className='w-6 h-6 rounded bg-zinc-900 p-1' onCheckedChange={(checked) => {
              if(checked) {
                setUseVoiceChannel(true)
              }else {
                setUseVoiceChannel(false)
              }
            }}>
              <CheckBox.CheckboxIndicator>
                <Check className='w-4 h-4 text-emerald-400' />
              </CheckBox.CheckboxIndicator>
            </CheckBox.Root>
            Costumo me conectar ao chat de voz
          </label>

          <footer className='mt-4 flex justify-end gap-4'>
            <Dialog.Close type='button' className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'>Cancelar</Dialog.Close>
            <button type='submit' className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600'>
              <GameController className='w-6 h-6' />
              Encontrar
            </button>
          </footer>
        </form>
      </Dialog.DialogContent>
    </Dialog.Portal>
  )
}
