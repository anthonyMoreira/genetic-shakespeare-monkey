const { default: Population } = require("@/genetic/population");
const { useState, useEffect } = require("react");
const { default: PopulationList } = require("./PopulationList");
const { default: PopulationStats } = require("./PopulationStats");

const App = () => {
    const [population, setPopulation] = useState(null);

    useEffect(() => {
        //Infinite render loop until we find the winning generation
        let pop = population;
        if (!pop) {
            pop = new Population(500, 0.01, "to be or not to be that is the question. yes my life is miserable");
            pop.setupPopulation();
            pop.calcFitness();
        }
        if (pop.foundSolution() === false) {
            pop = pop.copy();
            pop.newGeneration();
            pop.calcFitness();
            setPopulation(pop);
        }
    }, [population]);

    return (
        <div className="flex">
            {population && <PopulationStats population={population} />}
            {population && <PopulationList population={population} />}
        </div>
    );
};

export default App;