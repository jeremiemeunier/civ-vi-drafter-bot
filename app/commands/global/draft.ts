const commands = {
  name: "draft",
  description: "Launch draft sequence",
  default_member_permissions: 0,
  options: [
    {
      name: "number_of_players",
      description: "How much player ?",
      type: 4,
      required: true,
    },
    {
      name: "number_of_choices",
      description: "How much choices ?",
      type: 4,
      required: true,
    },
  ],
};

module.exports = {
  data: commands,
};
