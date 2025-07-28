import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { useCreateRoom } from '@/http/use-search-summoner'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import {
  Form,
  FormControl,
  FormField, 
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'

const createRoomSchema = z.object({
  nickAndTag: z.string().min(3, { message: 'Inclua no mínimo 3 caracteres' }),
  region: z.enum(['BR', 'NA', 'KR']),
})

type CreateRoomFormData = z.infer<typeof createRoomSchema>

export function SearchSummonerForm() {
  const { mutateAsync: createRoom } = useCreateRoom()

  const createRoomForm = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      nickAndTag: '',
      region: 'BR'
    },
  })

  async function handleCreateRoom({ nickAndTag, region }: CreateRoomFormData) {
    const [nickname, tagname] = nickAndTag.split('#')
    await createRoom({ nickname, tagname, region })

    createRoomForm.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buscar usuário</CardTitle>
        <CardDescription>
          
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...createRoomForm}>
          <form
            className="flex flex-col gap-4"
            onSubmit={createRoomForm.handleSubmit(handleCreateRoom)}
          >
            <FormField
              control={createRoomForm.control}
              name="nickAndTag"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Nome do invocador + Tag</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nick#BR1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <Button className="w-full" type="submit">
              Buscar invocador
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
