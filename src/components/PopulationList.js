const PopulationList = ({population}) => {
    const popArray = population.getPopulation();
    return (
        <div className="flex-initial w-2/3">
            {popArray.sort((a,b) => b.getFitness() - a.getFitness()).slice(0, 50).map((p, index) => <div key={index}>{`${p.toString()} - ${p.getFitness()}`}</div>)}
        </div>
    );
};
export default PopulationList;  