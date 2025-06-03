# DOCUMENTAÇÃO COMPONENTES


### Configuração da IDE
________________________

- Arquivos de configuração da ide estão na pasta ideConfig na pasta principal do projeto
- Para adicionar incluir acessar o settings da ide e importar os arquivos, o local de importação é o nome do arquivo


### Atualização do banco
________________________

- Para efetuar a atualização do banco é necessário incrementar a versão do esquema para que o realm efetue as alterações
- Caso a alteração necessite de interação isso pode ser feito pelos arquivos de migração, global ou específico de cada modulo
- Ex: Pessoa tem atributo noma, agora terá Nome e Sobrenome, criar uma regra no global, visto que é um model global.
Especificar para qual versão será feita essa atualização, pois ela não é executada sempre, somente nessa atualização.
Então pode ser programado normalmente, por exemplo dando um split e setando para a nova coluna

### Organização props
________________________

- Nomes do type em orden alfabética

1 - Required

2 - Opcionais


### Organização functions
________________________

1 - Construtor

    
2 - Métodos de ciclo de vida
    
    a - useProps
    a - useRef
    b - useEffect
    c - useCallbback

    
3 - Métodos de component
    
    a - Métodos on
    a - Métodos handle
    b - Validações
    
4 - Render

5 - StyleSheet


### Organização components
________________________

- Nomes de props em orden alfabética


### Organização StyleSheet
________________________

- Nomes da class em orden alfabética
