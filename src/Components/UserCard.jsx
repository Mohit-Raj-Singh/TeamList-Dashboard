import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, userCardSuccess } from "../Redux/action";
import Pagination from "./Pagination";
import styles from "./UserCard.module.css";
import axios from "axios";
import {
  Box,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import Filter from "./Filter";

const UserCard = () => {
  const [page, setPage] = useState(1);
  const user = useSelector((state) => state.UserReducer.users);
  const dispatch = useDispatch();
  console.log(user);

  const ref = useRef(null);
  const [hiddenDiv, setHiddenDiv] = useState(false);
  const [data, setData] = useState([]);
  const [searchVal, setSearchVal] = useState("");

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initQuery = searchParams.get("q");

  //search

  useEffect(() => {
    fetchData(searchVal);
  }, [searchVal]);

  const fetchData = (searchVal) => {
    let full_name = searchVal.split(" ");
    fetch(
      `https://mock4-server-uoq7.onrender.com/users?first_name=${full_name[0]}&?last_name=${full_name[1]}`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        console.log(res, " search input data after fetched ");
      });
  };

  const debounce = (fn, timeout) => {
    let timerid;
    return () => {
      clearTimeout(timerid);
      timerid = setTimeout(() => {
        fn();
      }, timeout);
    };
  };
  const handleinput = debounce(() => {
    const val = ref.current.value;
    console.log(" event val check in debounce ", val);
    setHiddenDiv(true);
    setSearchVal(val);
  }, 500);

  window.addEventListener("click", (e) => {
    console.log(e.target.id, " check window ");
    if (e.target.id !== "inputBox") {
      setHiddenDiv(false);
    }
  });

  useEffect(() => {
    if (user.length === 0 || location || initQuery) {
      const gender = searchParams.getAll("gender");
      const domain = searchParams.getAll("domain");
      const available = searchParams.getAll("available");
      const q = searchParams.get("q");
      const limit = 20;
      const getUsersParams = {
        params: {
          gender,
          domain,
          available,
          _limit: limit,
          _page: page,
        },
      };

      dispatch(getAllUsers(getUsersParams));
      console.log(page);
    }
  }, [dispatch, location.search, searchParams, initQuery, page]);

  return (
    <>
      <h2>Users List</h2>

      {/* =======Filter======== */}

      <Filter />

      {/* =======search======== */}

      <Box w="34%" pos={"relative"}>
        <InputGroup>
          <Input
            placeholder="Search"
            bg="white"
            w="100%"
            borderRadius="2px"
            h="36px"
            fontSize="14px"
            ref={ref}
            onInput={handleinput}
            id="inputBox"
          />

          <InputRightElement
            pos="absolute"
            zIndex="10"
            children={
              <IoSearchSharp
                color="black"
                cursor="pointer"
                fontSize="23px"
                fontWeight="bold"
              />
            }
          />
        </InputGroup>
        <Box
          display={hiddenDiv ? "" : "none"}
          pos={"absolute"}
          zIndex={"10"}
          maxH="320px"
          overflowY={"auto"}
          borderRadius="0 0 2px 2px"
          borderTop={"1px solid #e0e0e0"}
          w="100%"
          bg="#fff"
          boxShadow={"2px 3px 5px -1px rgb(0 0 0 / 50%)"}
        >
          {data.map((item, index) => (
            <Box key={index}>
              <NavLink to={`/searchResult/${item.id}`}>
                <Flex
                  gap={2}
                  p="10px 25px"
                  m="10px 0"
                  align={"center"}
                  cursor="pointer"
                  _hover={{ bg: "#F5F8FF" }}
                >
                  <Box maxH="32px" w="32px">
                    <Image maxH="30px" maxW="32px" src={item.avatar} />
                  </Box>
                  <Box color={"#212121"}>
                    {item.first_name + " " + item.last_name}
                  </Box>
                </Flex>
              </NavLink>
            </Box>
          ))}
        </Box>
      </Box>

      <div className={styles.userCard}>
        {user.length > 0 &&
          user.map((el) => (
            <div key={el.id} className={styles.container}>
              <img src={el.avatar} alt={el.first_name} />
              <h3>Name: {el.first_name + " " + el.last_name}</h3>
              <p>Email: {el.email}</p>
              <p>Gender: {el.gender}</p>
              <p>Domain: {el.domain}</p>
              <p>{el.available}</p>
            </div>
          ))}

        <Pagination
          total={user?.length}
          current={page}
          onChange={(page) => setPage(page)}
        />
      </div>
    </>
  );
};

export default UserCard;
