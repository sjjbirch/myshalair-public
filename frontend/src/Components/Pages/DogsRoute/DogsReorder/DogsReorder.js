import { useGlobalState, DogCard } from "../../../utils/componentIndex";
import { SortableItem } from '../../SortableItem';
import { Box, Typography, Paper, Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { getDogs, pushNewPositions } from "../../../services/dogsServices";
import { useNavigate } from "react-router";

const DogsReorder = () => {
  // initalises store from global state
  const { store, dispatch } = useGlobalState();
  // makes doglist available
  const { dogList } = store;
  const navigate = useNavigate();

  // sets initial states of pag
  const [activeId, setActiveId] = useState(null); //<= stores the id of the dragging element
  const [dogs, setDogs] = useState([]); // <= stores the dogs that are being displayed
  const [positions, setPositions] = useState([]); // <= stores the existing positions of displayed dogs


  // on component mount and on dogList change, checks if dogList has more than 0 values, if true, sorts dogList by position value and assigns to dogs state
  useEffect(() => {
    if (dogList.length > 0) {
      setDogs(dogList.sort((a, b) => a.position - b.position));
    }
  }, [dogList]);

  // triggered on button click, creates object containing dogs key and an emprty array value
  const handleSave = () => {
    const finalList = { dogs: [] };
    // itterates over dogs state, locates thier original object from dogList then compares psoition values, if they are different, pushes and object containing the dogs id and new position value int othe finalList.dogs array
    dogs.forEach((dog) => {
      const original = dogList.find(original => original.id === dog.id);
      if (dog.position !== original.position) {
        finalList.dogs.push({
          "id": dog.id,
          "position": dog.position
        });
      }
    });
    // makes patch request to back containing object which all new dog positions, if response status is 200, makes a get request to dogs#index and refreshes dogList with new dog list, then navigates to dogs/manage and triggers success alert
    pushNewPositions(finalList)
      .then(reply => {

        if (reply.status === 201) {
          getDogs()
            .then(dogs => {

              dispatch({
                type: "setDogList",
                data: dogs
              });
              navigate('/dogs/manage', { state: { alert: true, location: '/dogs/manage', severity: 'success', title: 'Success', body: 'Dogs positions successfully updated' } });
            })
            .catch(e => console.log(e)); // console logs any errors that occur when getting dogs
        }
      })
      .catch(e => console.log(e)); //console logs any errors that occur when patching dogs
  };

  // defines sensores drag and drop will use with their applicable constraints
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 1000,
        tolerance: 25,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // function that is called when dragStart hook is called, sets positions state and active id state, the latter is used to track the draged container
  const handleDragStart = (e) => {
    const { active } = e;
    setActiveId(active.id);
    setPositions(dogs.map(dog => dog.position));
  };

  // called when dragEnd hook is called, updates dogs based on the current active containers id, the the id the active container is over, also updates dogs positions based on their new position in the array, then clears activeId state
  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active.id !== over.id) {
      setDogs((dogs) => {
        var activePos = dogs.findIndex((dog) => dog.id === active.id);
        var overPos = dogs.findIndex((dog) => dog.id === over.id);
        return setNewPositions(arrayMove(dogs, activePos, overPos));
      });
    }

    setActiveId(null);
  };

  // function that reassins dogs position value to the position state value of their index
  const setNewPositions = (arrMove) => {
    return arrMove.map((dog, index) => {
      return {
        ...dog,
        position: positions[index]
      };
    });
  };


  return (
    <Box>
      <Button onClick={handleSave}>Save New Positions</Button>
      <Button onClick={() => navigate('..')}>Cancel</Button>
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="h2" >Reorder Dogs</Typography>
      </Box>
      <Box component={Paper} sx={{ px: 2 }}>
        <Grid
          container
          spacing={2}
          justifyContent="space-evenly"
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={dogs} strategy={rectSortingStrategy}>
              {dogs.map((dog, index) =>
                <Grid
                  key={index}
                  xs={12} sm={6} md={4} lg={3}
                  sx={{ maxHeight: '550px' }}
                >
                  <SortableItem id={dog.id} component={"div"} item={<DogCard dog={dog} />} />
                </Grid>
              )}
            </SortableContext>
            <DragOverlay>{activeId ?
              <>
                <DogCard id={activeId} dog={dogs.find(dog => dog.id === activeId)} />
              </>
              :
              null
            }</DragOverlay>
          </DndContext>
        </Grid>
        {/* <Pagination count={pageCount} page={page} onChange={handleChangePage} /> */}
      </Box>
    </Box>
  );

};

export default DogsReorder;