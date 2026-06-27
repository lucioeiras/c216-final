import { useNavigate } from 'react-router-dom';
import { useEquipes, usePartidas } from '../hooks/useDashboardData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export function Dashboard() {
  const navigate = useNavigate();
  const { data: equipes, isLoading: isLoadingEquipes } = useEquipes();
  const { data: partidas, isLoading: isLoadingPartidas } = usePartidas();

  const isLoading = isLoadingEquipes || isLoadingPartidas;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-lg">Visão geral das seleções e próximos confrontos da Copa 2026.</p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <Skeleton className="h-10 w-1/3 mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 space-y-4">
              <Skeleton className="h-10 w-1/3 mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <section className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Equipes Participantes</h2>
                  <p className="text-sm text-muted-foreground">Listagem de todas as seleções cadastradas</p>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {equipes?.length || 0}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {equipes?.map((equipe) => (
                  <Card 
                    key={equipe.id} 
                    className="hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/equipe/${equipe.id}`)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center gap-4">
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <span className="text-2xl font-bold">
                          {equipe.nome.charAt(0)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {equipe.nome}
                      </h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Próximos Jogos</h2>
                  <p className="text-sm text-muted-foreground">Calendário de confrontos da fase de grupos</p>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {partidas?.length || 0}
                </Badge>
              </div>

              <ScrollArea className="h-[70vh] rounded-md border p-4 bg-card">
                <div className="space-y-4">
                  {partidas?.map((partida) => {
                    const date = new Date(partida.data);
                    const formattedDate = date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
                    const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    
                    const teamA = partida.equipes[0]?.equipe.nome || 'TBD';
                    const teamB = partida.equipes[1]?.equipe.nome || 'TBD';

                    return (
                      <Card key={partida.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-3 pt-4 border-b">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs font-semibold bg-background">Fase de Grupos</Badge>
                            <div className="text-right">
                              <p className="text-sm font-medium capitalize">{formattedDate}</p>
                              <p className="text-xs text-muted-foreground">{formattedTime}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6 pb-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 text-center">
                              <p className="font-bold text-lg">{teamA}</p>
                            </div>
                            <div className="px-4">
                              <span className="text-muted-foreground font-bold text-sm bg-muted rounded-full px-3 py-1">VS</span>
                            </div>
                            <div className="flex-1 text-center">
                              <p className="font-bold text-lg">{teamB}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
