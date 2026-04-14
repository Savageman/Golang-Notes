---
title: "Testable Services Without Interfaces"
date: 2026-04-08
author: "Julian Espérat"
tags: ["Go Patterns", "Testing", "Dependency Injection"]
summary: "I usually don't use interfaces, and prefer function signatures. Here's the pattern applied to a plant watering service with sensors and recommendations."
draft: false
---

<div class="section" id="intro">

I usually don't use interfaces, and prefer function signatures.
This keeps dependencies explicit, testable, and easy to swap — without the
ceremony of defining interface types that often have a single implementation.

Here's the pattern applied to a simple plant watering service.

</div>

<div class="section" id="leaf-services">
<h2><a href="#leaf-services" class="anchor">Leaf services</a></h2>

Each leaf service is a plain struct with a concrete method. No interface needed
at this level — the function signature is the contract.

### Sensors checker

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

### Recommender

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

</div>

<div class="section" id="composition">
<h2><a href="#composition" class="anchor">Composing with function fields</a></h2>

The orchestrating service stores its dependencies as **function fields**
rather than interface fields. The constructor wires them to the real
implementations, but tests can replace any dependency with a plain closure.

```go
// plant_watering.go
package plantwatering

type PlantWatering struct {
    checkSensors       func(plantID string) (PlantSensors, error)
    getRecommendations func(PlantSensors) (PlantRecommendations, error)
}

func NewPlantWatering(sensors SensorsChecker, reco Recommender) *PlantWatering {
    return PlantWatering{
        checkPlantSensors:  sensors.checkPlant,
        getRecommendations: reco.getRecommendations,
    }
}

func (p *PlantWatering) getRecommendationForPlant(plantID string) (Recommendations, error) {
    sensors, err := p.checkPlantSensors(plantID)
    if err != nil {
        return nil, errors.Wrapf("check sensors: %w", error)
    }

    recommendations, err := p.getRecommendations(sensors)
    if err != nil {
        return nil, errors.Wrapf("get recommendations: %w", error)
    }

    return recommendations, nil
}
```

</div>
