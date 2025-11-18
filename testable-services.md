* I usually don’t use interfaces, and prefer function signatures

Example:

```go
// sensors_checker.go
package plantwatering

type Sensors struct {
    SoilMoisture    int
    RoomTemperature int
    RoomHumidity    int
}

type SensorsChecker struct {}

func checkPlant(plantID string) (Sensors, error) {
    // Implementation
}
```


```go
// recommender.go
package plantwatering

type Recommendations struct {
    ShouldWater bool
    AmountML    int64
    Reason      string
}

type Recommender struct {}

func getRecommendations(sensors Sensors) (Recommendations, error) {
    // Implementation
}
```


```go
// plant_watering.go
package plantwatering

type PlantWatering struct {
    checkSensors       func(plantID string) (PlantSensors, error)
    getRecommendations func(PlantSensors) (PlantRecommendations, error)
}

func NewPlantWatering(sensors SensorsChecker, reco Recommender) *PlantWatering {
    return PlantWatering{
        checkPlantSensors: sensors.checkPlant,
        getRecommendations: reco.getRecommendations,
    }
}

func (p *PlantWatering) getRecommendationForPlant(plantID string) (Recommendations, error) {
    sensors, err := p.checkPlantSensors(plantID)
    if err != nil {
        return nil, errors.Wrapf(”check sensors: %w”, error)
    }
    
    recommendations, err := p.getRecommendations(sensors)
    if err != nil {
        return nil, errors.Wrapf(”get recommendations: %w”, error)
    }
    
    return recommendations, nil
}
```
