<template>
  <div id="workflow-container">
    <Nav />
    <ProjectInfo />
    <Menu />
    <TableToolbar />
    <Table />
    <TableDetails />
    <TableOptionsToolbar />
    <WorkflowOptions />
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";

import Nav from './Nav'
import ProjectInfo from "./ProjectInfo";
import Menu from "./Menu";
import TableToolbar from "./TableToolbar";
import Table from "./Table";
import TableDetails from "./TableDetails";
import TableOptionsToolbar from "./TableOptionsToolbar";
import WorkflowOptions from './WorkflowOptions';

export default {
  name: "Workflow",
  props: ["projectId"],
  components: {
    Nav,
    ProjectInfo,
    Menu,
    TableToolbar,
    Table,
    TableDetails,
    TableOptionsToolbar,
    WorkflowOptions
  },
  mounted: function () {
    this.init();
  },
  beforeRouteUpdate(to, from, next) {
    this.init();
    return next();
  },
  methods: {
    ...mapMutations('table',['changeOption']),
    ...mapMutations("project", ["changeUrlProjectId"]),
    ...mapActions("project", ["getProjectName"]),
    ...mapActions('table',['getWorkflows']),
    init: function () {
      this.getProjectName({ projectId: this.projectId });
      this.getWorkflows({ projectId: this.projectId });
      this.changeOption('settings');
    },
  },
};
</script>

<style lang="scss">
#workflow-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  overflow-x: hidden;
}
</style>