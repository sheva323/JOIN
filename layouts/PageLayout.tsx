import React from "react";
import { ReactNode } from "react";
// components
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
//styles
import { SidebarFilters } from "../components/Sidebar";
import { HighlightEvents } from "../components/HighlightEvents";
import Sticky from "react-stickynode";
import { Grid, GridItem, useColorModeValue } from "@chakra-ui/react";

type Props = {
  children: JSX.Element | JSX.Element[] | ReactNode;
  title: string;
  footer: boolean;
};
const PageLayout = ({ title, children, footer }: Props) => {
  const pageTitle = `DAOTool | ${title}`;
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Grid
        templateAreas={`"nav header header" "nav main event" "footer footer footer"`}
        gridTemplateRows={"50px 1fr 30px"}
        gridTemplateColumns={"1fr 5fr 1.5fr"}
        gap="12"
        color="blackAlpha.700"
        bg={useColorModeValue("neutrals.light.200", "neutrals.gray.500")}
        fontWeight="bold"
      >
        <GridItem pl="2" area={"header"}>
          <Header />
        </GridItem>
        <GridItem area={"nav"}>
          <Sticky>
            <SidebarFilters />
          </Sticky>
        </GridItem>
        <GridItem area={"main"}>
          <div className="flex flex-col min-h-screen">
            <main>{children}</main>
          </div>
        </GridItem>
        <GridItem mr="4" area={"event"}>
          <Sticky>
            <HighlightEvents />
          </Sticky>
        </GridItem>
        <GridItem area={"footer"}>{footer && <Footer />}</GridItem>
      </Grid>
    </>
  );
};

export default PageLayout;
