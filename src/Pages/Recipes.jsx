import React, { useEffect, useState } from 'react';
import image5 from "../images/image5.png";
import image3 from "../images/image3.jpg";
import "../Pages/Recipe.css";
import { CiSquarePlus } from "react-icons/ci";
import axios from 'axios';

const Recipes = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isRecipeAdded, setIsRecipeAdded] = useState(false);
  const [name, setName] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [description, setDescription] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); 
  const [editRecipe, setEditRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/recipe");
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const openEditModal = (recipe) => {
    setEditRecipe({ ...recipe });
    setIsEditModalVisible(true); 
  };
  
  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setEditRecipe(null); 
  };

  // Add recipe to db.json
  const handleAddRecipe = async (e) => {
    e.preventDefault();

    if (!name.trim() || !ingredient.trim() || !description.trim()){
      alert("All Fiels are required");
      return;
    }

    const newRecipe = {
      name,
      ingredients: ingredient,
      description,
    };

    try {
      const response = await axios.post("http://localhost:3000/recipe", newRecipe);
      setRecipes((prev) => [...prev, response.data]); 
      setIsRecipeAdded(true); 
      setName('');
      setIngredient('');
      setDescription('');
      closeModal();
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

  const handleEditChange = (e) =>{
    const {name, value} = e.target;
    setEditRecipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleEditRecipe = async (e) => {
    e.preventDefault(); 

      if(!editRecipe?.name.trim() || !editRecipe?.ingredients.trim() || !editRecipe?.description.trim()){
        alert("All fiels are required");
        return
      }

      try {
      const response = await axios.put(`http://localhost:3000/recipe/${editRecipe.id}`,editRecipe);
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.id === editRecipe.id ? response.data : recipe
        )
      );     
      // setIsEditModalVisible(false);
      // setEditRecipe(null);
      setSelectedRecipe(response.data);
      closeEditModal();
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const handleDeleteRecipe = async (id) =>{
    try{
      await axios.delete(`http://localhost:3000/recipe/${id}`);
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id!==id));
      if(selectedRecipe?.id == id){
        setSelectedRecipe(null);
      }
    }catch(error){
      console.error("Error deleting recipe:", error);
    }
}

    
  return (
    <div className="min-h-screen flex max-w-full flex-col md:flex-row">
      {/* Recipe List */}
      <div className="md:w-1/2 w-full bg-white flex flex-col items-center justify-center px-6 md:ps-36">
        <div className="flex gap-96 md:gap-10 border-b-2 border-r-2 border-l-2 w-full md:w-80 space-x-6 md:space-x-36 md:mt-0 mt-2">
          <h2 className="text-lg text-black mb-4 mt-4 pl-2">Recipe's List</h2>
          <CiSquarePlus className='mt-5 text-xl text-black'onClick={openModal} />          
          {/* <i className="fa-solid fa-plus mt-6 cursor-pointer" onClick={openModal}></i> */}
        </div>

        {!isRecipeAdded ? (
          <div className="items-center border-r-2 border-l-2 border-t-2 w-full md:w-80 p-20" style={{height:"460px"}}>
            <img src={image3} alt="Placeholder" className="mt-20 ms-24 md:ms-0" style={{width:"210px" , height:"150px"}}/>
            <button
              className="bg-[#548cfb] text-white px-2 py-1 rounded shadow hover:bg-blue-600 mt-5 ms-40 md:ms-7"
              onClick={openModal}
            >
              Add Recipe
            </button>
          </div>
        ) : (
          //add recipe garey paxi aaune box
          <div className="border-r-2 p-4 ms-1" style={{ height: "450px", width:"316px" }}>
            <ul className='me-36'>
              {recipes.map((recipe) => (
                <li
                  key={recipe.id}
                  className="text-lg font-medium mb-2 cursor-pointer ms-1"
                  onClick={() => setSelectedRecipe(recipe)} 
                >
                  {recipe.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recipe Details */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center md:pe-60 md:border-r-2" style={{ width: "600px"}}>
        {selectedRecipe ? (
          <div className="p-6 me-48 ms-32" style={{width:"600px", height:"515px"}}>
            <div className="flex justify-between items-center mt-2">
            <h2 className="text-lg mb-2">{selectedRecipe.name}'s Recipe</h2>
            <i className="fa-solid fa-pen-to-square ms-72 mb-2 cursor-pointer"
             onClick={() => openEditModal(selectedRecipe)}></i>
            <i className="fa-solid fa-trash mb-2 ms-1 cursor-pointer" onClick={()=>handleDeleteRecipe(selectedRecipe.id)}></i>
          </div>
           <hr />
            <h3 className="text-lg mt-2">Ingredients:</h3>
            <ul className="list-disc ml-5 mb-4">
              {selectedRecipe.ingredients.split(',').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h3 className="text-lg">Directions:</h3>
            <ul className="list-disc ml-5 mb-4">
              {selectedRecipe.description.split(',').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            {/* <li>{selectedRecipe.description}</li> */}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <img src={image5} alt="Placeholder" className="w-3/4 sm:w-1/2 md:w-80 mb-4 mr-3"/>
            <p className="text-black text-lg font-medium">
              Select a recipe for details!
            </p>
          </div>
        )}
      </div>

      {/* Add Recipe Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div
            className="form-container bg-white border p-6 rounded-lg shadow-lg w-96"
            style={{ width: "750px", height: "550px" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2>Add Recipe</h2>
              <i
                className="fa-solid fa-xmark cursor-pointer"
                onClick={closeModal}
              ></i>
            </div>
            <hr />

            {/* <form onSubmit={handleAddRecipe}> */}
              <div className="flex flex-col mt-6">
                <label className="rounded-md">Recipe Name</label>
                <input
                  className="border-2 mt-1 rounded-sm p-2 w-full"
                  type="text"
                  placeholder="Enter the recipe's name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex mt-5 space-x-3">
                <div className="flex flex-col w-1/2">
                  <label className="rounded-md">Recipe Ingredient</label>
                  <textarea
                    className="border-2 mt-1 rounded-md p-2"
                    rows="10"
                    placeholder="Enter ingredients separated by commas"
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="rounded-md">Recipe Description</label>
                  <textarea
                    className="border-2 mt-1 rounded-md p-2"
                    rows="10"
                    placeholder="Enter description here"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="mt-4 text-end space-x-3">
                <button
                  type="button"
                  className="border-2 px-4 py-2 rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button onClick={handleAddRecipe}
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 pt-2 rounded shadow hover:bg-blue-600"
                >
                  Add Recipe
                </button>
              </div>
            {/* </form> */}
          </div>
        </div>
      )} 
      
      
      {/* Edit Recipe Modal */}
      {isEditModalVisible && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div
            className="form-container bg-white border p-6 rounded-lg shadow-lg w-96"
            style={{ width: "750px", height: "550px" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2>Edit Recipe</h2>
              <i
                className="fa-solid fa-xmark cursor-pointer"
                onClick={closeEditModal}
              ></i>
            </div>
            <hr />

            {/* <form onSubmit={handleEditRecipe}> */}
            <div className="flex flex-col mt-6">
              <label className="rounded-md">Recipe Name</label>
              <input
                className="border-2 mt-1 rounded-sm p-2 w-full"
                type="text" name="name"
                 value={editRecipe?.name || ""}
                onChange={handleEditChange}
              />
            </div>
            <div className="flex mt-5 space-x-3">
              <div className="flex flex-col w-1/2">
                <label className="rounded-md">Recipe Ingredient</label>
                <textarea
                  className="border-2 mt-1 rounded-md p-2"
                  rows="10" name="ingredients"
                  value={editRecipe?.ingredients || ""}
                  onChange={handleEditChange}
                ></textarea>
              </div>
              <div className="flex flex-col w-1/2">
                <label className="rounded-md">Recipe Description</label>
                <textarea
                  className="border-2 mt-1 rounded-md p-2"
                  rows="10"  name="description"
                  value={editRecipe?.description || ""}
                  onChange={handleEditChange}
                ></textarea>
              </div>
            </div>
            <div className="mt-4 text-end space-x-3">
              <button
                className="border-2 px-4 py-2 rounded" onClick={closeEditModal}>
                Cancel
              </button>
              <button onClick={handleEditRecipe} type="submit" className="bg-blue-500 text-white px-4 py-2 pt-2 rounded shadow hover:bg-blue-600">
                Edit Recipe
              </button>
            </div>
            {/* </form> */}
          </div>
        </div>
      )}



    </div>
  );
};

export default Recipes;
