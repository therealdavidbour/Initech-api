import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .data import CATALOG

app = FastAPI(title="Recipe API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/broths")
def list_broths():
    return CATALOG["broths"]


@app.get("/noodles")
def list_noodles():
    return CATALOG["noodles"]


@app.get("/toppings")
def list_toppings():
    return CATALOG["toppings"]


@app.get("/randomize")
def randomize():
    return {
        "broth": random.choice(CATALOG["broths"]),
        "noodles": random.choice(CATALOG["noodles"]),
        "toppings": random.sample(CATALOG["toppings"], k=random.randint(2, 4)),
    }
