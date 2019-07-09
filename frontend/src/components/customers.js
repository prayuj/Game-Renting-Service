import React, { Component } from "react";
import Customer from "./customer";

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [
        {
          cid: 1,
          cname: "Prayuj Pillai",
          email: "prayuj@gmail.com",
          membershipJoinDate: "2019-02-16",
          membershipEndDate: "2020-02-16"
        },
        {
          cid: 2,
          cname: "Olivia Dsa",
          email: "oliviadsa@gmail.com",
          membershipJoinDate: "2018-05-12",
          membershipEndDate: "2018-11-12"
        },
        {
          cid: 3,
          cname: "Sagar Rao",
          email: "sagarrao@gmail.com",
          membershipJoinDate: "2019-02-16",
          membershipEndDate: "2020-02-16"
        },
        {
          cid: 4,
          cname: "Denzil Dsouza",
          email: "denzildsouza@gmail.com",
          membershipJoinDate: "2019-02-16",
          membershipEndDate: "2020-02-16"
        },
        {
          cid: 5,
          cname: "Denver Dsouza",
          email: "denver@gmail.com",
          membershipJoinDate: "2019-02-16",
          membershipEndDate: "2020-02-16"
        },
        {
          cid: 6,
          cname: "Sherman Sequeria",
          email: "shermansequeria@gmail.com",
          membershipJoinDate: "2019-02-16",
          membershipEndDate: "2020-02-16"
        }
      ]
    };
  }
  render() {
    return (
      <div>
        <table className="table" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email-ID</th>
              <th>Membership start</th>
              <th>Membership end</th>
            </tr>
          </thead>
          <tbody>
            {this.state.customers.map(customer => (
              <Customer
                id={customer.cid}
                name={customer.cname}
                email={customer.email}
                membershipEndDate={customer.membershipEndDate}
                membershipJoinDate={customer.membershipJoinDate}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Customers;
