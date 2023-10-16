const PopulationStats = ({population}) => {
    const populationArray = population.getPopulation();
    const fitnessAverage = computeAverage(populationArray);             
    const generation = population.getGeneration();
    const currentBest = population.getCurrentBest();
    return (
        <div className="flex-initial w-1/3">
            <h1 className="text-4xl mt-1" >Current best : {currentBest.toString()}</h1>
            <h1 className="text-2xl mt-4">Target : {population.getTarget()}</h1>
            <h2 className="text-2xl">Fitness average : {fitnessAverage}</h2>
            <h2 className="text-2xl">Generation : {generation}</h2>
            <h2 className="text-2xl">Mutation rate : {population.getMutationRate()}</h2>

        </div>
    );
};
const computeAverage = (arr) => {
    if (!arr || arr.length === 0) {
      return 0; // To avoid division by zero for empty arrays
    }
    const sum = arr.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.getFitness()
    }, 0);
    return sum / arr.length;
  }
export default PopulationStats;