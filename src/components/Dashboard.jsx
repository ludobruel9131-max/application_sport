function Dashboard() {
  const { state } = useContext(AppContext);

  // Sécurité : si goals n’existe pas encore, on met 0 par défaut
  const goals = state?.profile?.goals || {
    caloriesGoal: 0,
    proteinGoal: 0,
    fatGoal: 0,
  };

  const data = [
    { name: 'Calories', value: goals.caloriesGoal },
    { name: 'Protéines', value: goals.proteinGoal },
    { name: 'Lipides', value: goals.fatGoal },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Objectif de la semaine</CardTitle>
            <Trophy className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.caloriesGoal} kcal</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Macros</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                  {
                    data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                  }
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
