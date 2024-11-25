// import React, { useState } from 'react';
// import image1 from "../images/image1.jpg";
// import image3 from "../images/image3.jpg"
// import "../Pages/Recipe.css";

// const Recipes = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const openModal = () => setIsModalVisible(true);
//   const closeModal = () => setIsModalVisible(false);

//   return (
//     <div>
//       <div className="min-h-screen flex">
//         <div className="w-1/2 bg-white flex flex-col items-center justify-center ps-32">
//           <div className="flex gap-10 border-2 w-80 space-x-36">
//             <h2 className="text-xl mb-4 mt-4 pl-1">Recipe's List</h2>
//             <i
//               className="fa-solid fa-plus mt-6 cursor-pointer"
//               onClick={openModal}
//             ></i>
//           </div>
//           <div className="items-center border-2 w-80 p-20">
//             <img src={image3} alt="Placeholder" className='w-72 h-48' />
//             <button
//               className="bg-blue-500 text-white px-2 py-2 rounded shadow hover:bg-blue-600 mt-4 ms-8"
//               onClick={openModal}>
//               Add Recipe
//             </button>
//           </div>
//         </div>

        
//         <div className="w-1/2 flex flex-col items-center justify-center pe-56">
//           <div className="flex flex-col items-center">
//             <img src={image1} alt="Burger" className="w-48 h-48 mb-4" />
//             <p className="text-gray-500 text-lg font-medium">
//               Select a recipe for details!
//             </p>
//           </div>
//         </div>
//       </div>

//       {isModalVisible && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div
//             className="form-container bg-white border p-6 rounded-lg shadow-lg w-96"
//             style={{ width: "750px", height: "550px" }}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2>Add Recipe</h2>
//               <i
//                 className="fa-solid fa-xmark cursor-pointer"
//                 onClick={closeModal}
//               ></i>
//             </div>
//             <hr />
//             <div className="flex flex-col mt-6">
//               <label className="rounded-md">Recipe Name</label>
//               <input
//                 className="border-2 mt-1 rounded-sm p-2 w-full"
//                 type="text"
//                 placeholder="Enter the recipe's name"
//               />
//             </div>
//             <div className="flex mt-5 space-x-3">
//               <div className="flex flex-col w-1/2">
//                 <label className="rounded-md">Recipe Ingredient</label>
//                 <textarea
//                   className="border-2 mt-1 rounded-md p-2"
//                   rows="10"
//                   placeholder="Enter ingredients separately"
//                 ></textarea>
//               </div>
//               <div className="flex flex-col w-1/2">
//                 <label className="rounded-md">Recipe Description</label>
//                 <textarea
//                   className="border-2 mt-1 rounded-md p-2"
//                   rows="10"
//                   placeholder="Enter description here"
//                 ></textarea>
//               </div>
//             </div>
//             <div className="mt-4 text-end space-x-3">
//               <button
//                 className="border-2 px-4 py-2 rounded"
//                 onClick={closeModal}
//               >
//                 Cancel
//               </button>
//               <button className="bg-blue-500 text-white px-4 py-2 pt-2 rounded shadow hover:bg-blue-600">
//                 Add Recipe
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Recipes;












import React, { useEffect, useState } from 'react';
import image1 from "../images/image1.jpg";
import image3 from "../images/image3.jpg";
import "../Pages/Recipe.css";
import axios from 'axios';

const Recipes = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRecipeAdded, setIsRecipeAdded] = useState(false);
  const [name, setName] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [description, setDescription] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Track the selected recipe

  // Fetch recipes from db.json
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

  // Add recipe to db.json
  const handleAddRecipe = async (e) => {
    e.preventDefault();
    const newRecipe = {
      name,
      ingredients: ingredient,
      description,
    };

    try {
      const response = await axios.post("http://localhost:3000/recipe", newRecipe);
      setRecipes((prev) => [...prev, response.data]); // Update recipes list
      setIsRecipeAdded(true); // Change to list view after adding recipe
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

  const handleEditRecipe = async (e) =>{
    e.preventDefault();
    try{
      await axios.put(`http://localhost:3000/recipe/${editRecipe.id}`, editRecipe);
      setRecipes((prev) =>
        prev.map((recipe) => (recipe.id === editRecipe.id ? editRecipe : recipe))
      ); // Update the local recipes state
      closeEditModal();
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };



  return (
    <div className="min-h-screen flex">
      {/* Recipe List */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center ps-36">
        <div className="flex gap-10 border-2 w-80 space-x-36 ms-1">
          <h2 className="text-xl mb-4 mt-4 pl-2">Recipe's List</h2>
          <i className="fa-solid fa-plus mt-6 cursor-pointer" onClick={openModal}></i>
        </div>

        {!isRecipeAdded ? (
          <div className="items-center border-2 w-80 p-20">
            <img src={image3} alt="Placeholder" className="w-72 h-48" />
            <button
              className="bg-blue-500 text-white px-2 py-2 rounded shadow hover:bg-blue-600 mt-4 ms-8"
              onClick={openModal}
            >
              Add Recipe
            </button>
          </div>
        ) : (
          <div className="border-2 w-80 p-4 ms-1" style={{ height: "450px" }}>
            <ul className='me-36'>
              {recipes.map((recipe) => (
                <li
                  key={recipe.id}
                  className="text-lg font-medium mb-2 cursor-pointer ms-1"
                  onClick={() => setSelectedRecipe(recipe)} // Set selected recipe
                >
                  {recipe.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recipe Details */}
      <div className="w-1/2 flex flex-col items-center justify-center pe-60">
        {selectedRecipe ? (
          <div className="border-2 p-6 me-44" style={{width:"600px", height:"515px"}}>
            <div className="flex justify-between items-center mt-2">
            <h2 className="text-xl mb-2">{selectedRecipe.name}'s Recipe</h2>
            <i className="fa-solid fa-pen-to-square ms-64 mb-2"></i>
            <i className="fa-solid fa-trash mb-2"></i>
          </div>
           <hr />
            <h3 className="text-lg mt-2">Ingredients:</h3>
            <ul className="list-disc ml-5 mb-4">
              {selectedRecipe.ingredients.split(',').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h3 className="text-lg">Directions:</h3>
            <li>{selectedRecipe.description}</li>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <img src={image1} alt="Placeholder" className="w-48 h-48 mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              Select a recipe for details!
            </p>
          </div>
        )}
      </div>

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

            <form onSubmit={handleAddRecipe}>
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
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 pt-2 rounded shadow hover:bg-blue-600"
                >
                  Add Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )} 
      
      
      
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div
            className="form-container bg-white border p-6 rounded-lg shadow-lg w-96"
            style={{ width: "750px", height: "550px" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2>Edit Recipe</h2>
              <i
                className="fa-solid fa-xmark cursor-pointer"
                
              ></i>
            </div>
            <hr />
            <div className="flex flex-col mt-6">
              <label className="rounded-md">Recipe Name</label>
              <input
                className="border-2 mt-1 rounded-sm p-2 w-full"
                type="text"
                placeholder="Enter the recipe's name"
              />
            </div>
            <div className="flex mt-5 space-x-3">
              <div className="flex flex-col w-1/2">
                <label className="rounded-md">Recipe Ingredient</label>
                <textarea
                  className="border-2 mt-1 rounded-md p-2"
                  rows="10"
                  placeholder="Enter ingredients separately"
                ></textarea>
              </div>
              <div className="flex flex-col w-1/2">
                <label className="rounded-md">Recipe Description</label>
                <textarea
                  className="border-2 mt-1 rounded-md p-2"
                  rows="10"
                  placeholder="Enter description here"
                ></textarea>
              </div>
            </div>
            <div className="mt-4 text-end space-x-3">
              <button
                className="border-2 px-4 py-2 rounded"
                
              >
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 pt-2 rounded shadow hover:bg-blue-600">
                Edit Recipe
              </button>
            </div>
          </div>
        </div>





    </div>
  );
};

export default Recipes;
